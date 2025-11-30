// db/index.js
const RecordModel = require('../models/Record');
const recordUtils = require('./record');
const vaultEvents = require('../events');

// Add a new record
async function addRecord({ name, value }) {
  try {
    recordUtils.validateRecord({ name, value });
    
    const newRecord = new RecordModel({
      name,
      value,
      created: new Date()
    });
    
    const savedRecord = await newRecord.save();
    
    const recordData = {
      id: savedRecord._id.toString(),
      name: savedRecord.name,
      value: savedRecord.value,
      created: savedRecord.created
    };
    
    vaultEvents.emit('recordAdded', recordData);
    return recordData;
  } catch (error) {
    console.error('Error adding record:', error.message);
    throw error;
  }
}

// List all records
async function listRecords() {
  try {
    const records = await RecordModel.find({}).sort({ created: 1 });
    
    return records.map(record => ({
      id: record._id.toString(),
      name: record.name,
      value: record.value,
      created: record.created
    }));
  } catch (error) {
    console.error('Error listing records:', error.message);
    return [];
  }
}

// Update a record by ID
async function updateRecord(id, newName, newValue) {
  try {
    if (!recordUtils.isValidId(id)) {
      console.log('❌ Invalid record ID format.');
      return null;
    }
    
    const updatedRecord = await RecordModel.findByIdAndUpdate(
      id,
      { name: newName, value: newValue },
      { new: true, runValidators: true }
    );
    
    if (!updatedRecord) return null;
    
    const recordData = {
      id: updatedRecord._id.toString(),
      name: updatedRecord.name,
      value: updatedRecord.value,
      created: updatedRecord.created
    };
    
    vaultEvents.emit('recordUpdated', recordData);
    return recordData;
  } catch (error) {
    console.error('Error updating record:', error.message);
    return null;
  }
}

// Delete a record by ID
async function deleteRecord(id) {
  try {
    if (!recordUtils.isValidId(id)) {
      console.log('❌ Invalid record ID format.');
      return null;
    }
    
    const deletedRecord = await RecordModel.findByIdAndDelete(id);
    
    if (!deletedRecord) return null;
    
    const recordData = {
      id: deletedRecord._id.toString(),
      name: deletedRecord.name,
      value: deletedRecord.value,
      created: deletedRecord.created
    };
    
    vaultEvents.emit('recordDeleted', recordData);
    return recordData;
  } catch (error) {
    console.error('Error deleting record:', error.message);
    return null;
  }
}

// Restore records from backup
async function restoreRecords(records) {
  try {
    // Clear existing records
    await RecordModel.deleteMany({});
    
    // Insert backup records
    if (records.length > 0) {
      const recordsToInsert = records.map(r => ({
        name: r.name,
        value: r.value,
        created: r.created
      }));
      
      await RecordModel.insertMany(recordsToInsert);
    }
    
    return true;
  } catch (error) {
    console.error('Error restoring records:', error.message);
    return false;
  }
}

// Get database statistics
async function getStats() {
  try {
    const count = await RecordModel.countDocuments();
    
    return {
      totalRecords: count
    };
  } catch (error) {
    console.error('Error getting stats:', error.message);
    return null;
  }
}

module.exports = { 
  addRecord, 
  listRecords, 
  updateRecord, 
  deleteRecord,
  restoreRecords,
  getStats
};