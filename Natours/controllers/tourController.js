const Tour = require('../models/tourModel');

exports.alias = async (req, res, next) => {
  req.query = {
    sort: '-ratingsAverage price',
    limit: 5,
    fields: 'name,price,ratingsAverage,summary,difficulty'
  };
  next();
};

exports.getAllTours = async (req, res) => {
  const queryObj = { ...req.query };

  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  const obj = JSON.parse(
    JSON.stringify(queryObj)
      .replace(/:{"/g, ':{"$')
      .split(',')
  );

  try {
    let query = Tour.find(obj);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    if (req.query.fields) {
      const projectIt = req.query.fields.split(',').join(' ');
      query = query.select(projectIt);
    } else {
      query = query.select('-__v');
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const numToSkip = (page - 1) * limit;

    query = query.skip(numToSkip).limit(limit);

    if (req.query.page) {
      const numDocs = await Tour.countDocuments();
      if (numToSkip >= numDocs) throw new Error('This page does not exists!');
    }

    const tours = await query;

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
      message: err.message
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
