'use strict';

async function getDocsArrayByIds (Model, ObjectIdsArray) {
  try {
    var documents = [];
    await ObjectIdsArray.forEach(async ObjectId => {
      var document = await Model
        .findOne({ _id: ObjectId, 'meta.is_active': true, 'meta.is_deleted': false });
      // eslint-disable-next-line no-new
      if (!document) throw new Error('Document no found!');
      documents.push(document);
    });
    return documents;
  } catch (e) {
    return { status: 500, description: e.message };
  }
};

module.exports = {
  getDocsArrayByIds
};
