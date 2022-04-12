class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    const queryStr = JSON.parse(
      JSON.stringify(queryObj)
        .replace(/:{"/g, ':{"$')
        .split(',')
    );

    this.query = this.query.find(queryStr);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  projection() {
    if (this.queryString.fields) {
      const projectIt = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(projectIt);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const numToSkip = (page - 1) * limit;

    this.query = this.query.skip(numToSkip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
