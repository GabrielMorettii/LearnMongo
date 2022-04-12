const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  const queryObj = { ...req.query };

  const params = ['duration', 'difficulty'];

  const filterParams = queryObj.map(el => params.includes(el));

  console.log(filterParams);

  try {
    const tours = await Tour.find();

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(duration)
    //   .where('difficulty')
    //   .equals(difficulty);

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: 'An error has ocurred!'
    });
  }
};

exports.getTour = async (req, res) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: 'An error has ocurred!'
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: 'An error has ocurred!'
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success'
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: 'An error has ocurred!'
    });
  }
};
