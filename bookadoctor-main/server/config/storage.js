const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Disable buffering so operations fail immediately (not after 10s timeout)
// when MongoDB is unavailable — allows instant fallback to file-based storage
mongoose.set('bufferCommands', false);

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const getFilePath = (collectionName) => path.join(dataDir, `${collectionName}.json`);

function readCollection(collectionName) {
  const filePath = getFilePath(collectionName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

function writeCollection(collectionName, data) {
  const filePath = getFilePath(collectionName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function generateId() {
  return new mongoose.Types.ObjectId().toString();
}

function matchesFilter(item, filter = {}) {
  for (const key of Object.keys(filter)) {
    if (key === '$or' && Array.isArray(filter.$or)) {
      const matchAny = filter.$or.some((subFilter) => matchesFilter(item, subFilter));
      if (!matchAny) return false;
      continue;
    }

    const val = filter[key];
    const itemVal = item[key];

    if (val && typeof val === 'object' && val.$ne !== undefined) {
      if (itemVal === val.$ne) return false;
      continue;
    }

    if (itemVal === undefined) {
      if (key === '_id' && item.id) {
        if (item.id.toString() !== val?.toString()) return false;
        continue;
      }
      return false;
    }

    if (val !== undefined && itemVal !== undefined) {
      if (itemVal.toString().toLowerCase() !== val.toString().toLowerCase()) {
        return false;
      }
    }
  }
  return true;
}

class ModelWrapper {
  constructor(collectionName, mongooseModel) {
    this.collectionName = collectionName;
    this.mongooseModel = mongooseModel;
  }

  isMongoActive() {
    return mongoose.connection && mongoose.connection.readyState === 1;
  }

  async findOne(filter = {}) {
    if (this.isMongoActive()) {
      try {
        return await this.mongooseModel.findOne(filter);
      } catch (err) {}
    }
    const items = readCollection(this.collectionName);
    const found = items.find((item) => matchesFilter(item, filter));
    if (!found) return null;
    return this.wrapDoc(found);
  }

  async findById(id) {
    if (this.isMongoActive()) {
      try {
        return await this.mongooseModel.findById(id);
      } catch (err) {}
    }
    const items = readCollection(this.collectionName);
    const found = items.find((item) => (item._id || item.id)?.toString() === id?.toString());
    if (!found) return null;
    return this.wrapDoc(found);
  }

  find(filter = {}) {
    if (this.isMongoActive()) {
      return this.mongooseModel.find(filter);
    }
    const items = readCollection(this.collectionName);
    const results = filter && Object.keys(filter).length > 0
      ? items.filter((item) => matchesFilter(item, filter))
      : items;

    const wrappedResults = results.map((item) => this.wrapDoc(item));

    const selectFn = (docs, fieldsStr) => {
      if (!fieldsStr) return docs;
      const fields = fieldsStr.split(' ');
      const excludes = fields.filter(f => f.startsWith('-')).map(f => f.slice(1));
      const includes = fields.filter(f => !f.startsWith('-'));
      return docs.map(doc => {
        const result = { ...doc };
        if (excludes.length > 0) excludes.forEach(f => { delete result[f]; });
        else if (includes.length > 0) {
          const filtered = {};
          includes.forEach(f => { if (result[f] !== undefined) filtered[f] = result[f]; });
          return filtered;
        }
        return result;
      });
    };

    const buildChain = (docs) => ({
      sort: () => buildChain(docs),
      select: (fields) => buildChain(selectFn(docs, fields)),
      then: (resolve, reject) => Promise.resolve(docs).then(resolve, reject),
      exec: async () => docs,
    });

    return buildChain(wrappedResults);
  }

  async findByIdAndUpdate(id, updateData, options = { new: true }) {
    if (this.isMongoActive()) {
      try {
        return await this.mongooseModel.findByIdAndUpdate(id, updateData, options);
      } catch (err) {}
    }
    const items = readCollection(this.collectionName);
    const idx = items.findIndex((item) => (item._id || item.id)?.toString() === id?.toString());
    if (idx === -1) return null;

    // Handle $set operator
    const patch = updateData.$set ? updateData.$set : updateData;
    items[idx] = { ...items[idx], ...patch, updatedAt: new Date().toISOString() };
    writeCollection(this.collectionName, items);
    return this.wrapDoc(items[idx]);
  }

  async findOneAndUpdate(filter, updateData, options = { new: true }) {
    if (this.isMongoActive()) {
      try {
        return await this.mongooseModel.findOneAndUpdate(filter, updateData, options);
      } catch (err) {}
    }
    const items = readCollection(this.collectionName);
    const idx = items.findIndex((item) => matchesFilter(item, filter));
    if (idx === -1) return null;

    // Handle $set operator
    const patch = updateData.$set ? updateData.$set : updateData;
    items[idx] = { ...items[idx], ...patch, updatedAt: new Date().toISOString() };
    writeCollection(this.collectionName, items);
    return this.wrapDoc(items[idx]);
  }

  async countDocuments(filter = {}) {
    if (this.isMongoActive()) {
      try {
        return await this.mongooseModel.countDocuments(filter);
      } catch (err) {}
    }
    const items = readCollection(this.collectionName);
    if (!filter || Object.keys(filter).length === 0) return items.length;
    return items.filter((item) => matchesFilter(item, filter)).length;
  }

  async create(data) {
    if (this.isMongoActive()) {
      try {
        return await this.mongooseModel.create(data);
      } catch (err) {}
    }
    const items = readCollection(this.collectionName);
    if (Array.isArray(data)) {
      const createdList = data.map((d) => {
        const item = {
          _id: d._id || generateId(),
          ...d,
          createdAt: d.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return item;
      });
      items.push(...createdList);
      writeCollection(this.collectionName, items);
      return createdList.map((i) => this.wrapDoc(i));
    } else {
      const item = {
        _id: data._id || generateId(),
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      items.push(item);
      writeCollection(this.collectionName, items);
      return this.wrapDoc(item);
    }
  }

  wrapDoc(rawItem) {
    const self = this;
    const doc = { ...rawItem };

    doc.save = async function () {
      if (self.isMongoActive()) {
        try {
          const mDoc = new self.mongooseModel(this);
          return await mDoc.save();
        } catch (err) {}
      }
      const items = readCollection(self.collectionName);
      if (!this._id) {
        this._id = generateId();
        this.createdAt = new Date().toISOString();
      }
      this.updatedAt = new Date().toISOString();

      const existingIndex = items.findIndex((i) => (i._id || i.id)?.toString() === this._id.toString());
      if (existingIndex >= 0) {
        items[existingIndex] = { ...this };
      } else {
        items.push({ ...this });
      }
      writeCollection(self.collectionName, items);
      return self.wrapDoc(this);
    };

    return doc;
  }

  instantiate(data) {
    if (this.isMongoActive()) {
      return new this.mongooseModel(data);
    }
    return this.wrapDoc({
      _id: generateId(),
      ...data,
      seenNotifications: data.seenNotifications || [],
      unseenNotifications: data.unseenNotifications || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

module.exports = {
  ModelWrapper,
};
