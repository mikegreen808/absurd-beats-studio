import database from "../services/database.js";
import {
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import accountSchema from "../models/track.js";

async function getAllTracks(req, res, next) {
  try {
    const params = {
      TableName: "Tracks",
    };
    const command = new ScanCommand(params);
    const result = await database.send(command);
    res.status(200).json(result.Items);
  } catch (err) {
    next(err);
  }
}

async function createTrack(req, res, next) {
  try {
    const uuid = uuidv4();
    req.body.id = uuid;
    const { error, value } = accountSchema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    const { id, title, bpm, key, existential_tag, notes } = value;

    const params = {
      TableName: "Tracks",
      Item: {
        id,
        title,
        bpm,
        key,
        existential_tag,
        notes,
      },
    };

    const command = new PutCommand(params);
    await database.send(command);
    res.status(201).json({ message: "Track created successfully", data:params.Item });
  } catch (error) {
    next(err);
  }
}

async function getTrackById(req, res, next) {
  const trackId = req.params.id; // <-- this is where we get the id from the request url
  try {
    const params = {
      TableName: "Tracks",
      Key: { id: trackId },
      };
      const command = new GetCommand(params);
      const result = await database.send(command);
      if (!result.Item) {
        res.status(404).json({ error: "Track not found" });
        return;
      }
      res.status(200).json(result.Item);
  } catch (err) {
    next(err);
  }
}

async function updateTrackById(req, res, next) {
  try {
    const trackId = req.params.id; 
    req.body.id = trackId;
    const { error, value } = accountSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, bpm, key, existential_tag, notes } = value;

    const params = {
      TableName: "Tracks",
      Key: { id: trackId },
    };
    const getCommand = new GetCommand(params);
    const result = await database.send(getCommand);
    const track = result.Item;
    
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    const updateParams = {
      TableName: "Tracks",
      Key: { id: trackId },
      UpdateExpression:
        "set title = :title, bpm = :bpm, #k = :key, existential_tag = :existential_tag, notes = :notes",
      ExpressionAttributeNames: {
        "#k": "key",
      },
      ExpressionAttributeValues: {
        ":title": title,
        ":bpm": bpm,
        ":key": key,
        ":existential_tag": existential_tag,
        ":notes": notes,
      },
      ReturnValues: "ALL_NEW",
    };

    const updateCommand = new UpdateCommand(updateParams);
    const updateResult = await database.send(updateCommand);
    res.status(200).json(updateResult.Attributes);
  } catch (err) {
    next(err);
  }
}

async function deleteTrackById(req, res) {
  const trackId = req.params.id; // <-- this is where we get the id from the request url
  try {
    const params = {
      TableName: "Tracks",
      Key: { id: trackId },
    };
    const command = new DeleteCommand(params);
    await database.send(command);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export default {
  getAllTracks,
  createTrack,
  getTrackById,
  updateTrackById,
  deleteTrackById,
};