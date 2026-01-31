import Event from "../models/Event.js";

export const getEvents = async (req, res) => {
  res.json(await Event.find());
};

export const createEvent = async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
};

export const updateEvent = async (req, res) => {
  res.json(
    await Event.findByIdAndUpdate(req.params.id, req.body, { new: true }),
  );
};

export const deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event deleted" });
};
