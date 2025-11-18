import express from "express";
import tracksController from "../controllers/tracksController.js";

const Router = express.Router();

Router.route("/tracks")
  .get(tracksController.getAllTracks)
  .post(tracksController.createTrack);

Router.route("/tracks/:id") // <-- this defines an endpoint with a "placeholder" for the id
  .get(tracksController.getTrackById)
  .put(tracksController.updateTrackById)
  .delete(tracksController.deleteTrackById);

export default Router;