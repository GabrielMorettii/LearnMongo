const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.alias = async (req, res, next) => {
  req.query = {
    sort: '-ratingsAverage price',
    limit: 5,
    fields: 'name,price,ratingsAverage,summary,difficulty'
  };
  next();
};

exports.getAllTours = async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .pagination()
    .projection();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTour = async (req, res) => {
  const { id } = req.params;

  const tour = await Tour.findById(id).populate('reviews');

  if (!tour) {
    throw new AppError('No tour found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.createTour = async (req, res) => {
  const tour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.updateTour = async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tour) {
    throw new AppError('No tour found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.deleteTour = async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    throw new AppError('No tour found with that ID', 404);
  }

  res.status(204).json({
    status: 'success'
  });
};

exports.getTourStats = async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(201).json({
    status: 'success',
    data: {
      stats
    }
  });
};

exports.getMonthlyPlan = async (req, res) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(201).json({
    status: 'success',
    data: {
      plan
    }
  });
};
