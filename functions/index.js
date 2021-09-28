const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const firestore = admin.firestore();

exports.adjustRating = functions.firestore
  .document("/games/{gameId}")
  .onCreate((snapshot, context) => {
    // snapshot.set(
    //   { timestamp: firestore.Timestamp.fromDate(new Date()) },
    //   { merge: true }
    // );

    const data = snapshot.data();

    return firestore.runTransaction((transaction) => {
      const docRefs = [];
      data.winners.forEach(function (player) {
        docRefs.push(firestore.doc("players/" + player._id));
      });
      return transaction.getAll(...docRefs).then((doc) => {
        if (doc.exists) {
          const rating = doc.get("rating");
          transaction.update(doc.ref, { rating: rating + 10 });
        }
      });
    });

    // firestore.runTransaction((transaction) => {
    //   const promises = [];

    //   data.winners.forEach(function (player) {
    //     const documentRef = firestore.doc("players/" + player._id);
    //     promises.push(
    //       transaction.get(documentRef).then((doc) => {
    //         if (doc.exists) {
    //           const rating = doc.get("rating");
    //           transaction.update(documentRef, { rating: rating + 10 });
    //         }
    //       })
    //     );
    //   });

    //   data.losers.forEach(function (player) {
    //     const documentRef = firestore.doc("players/" + player._id);
    //     promises.push(
    //       transaction.get(documentRef).then((doc) => {
    //         if (doc.exists) {
    //           const rating = doc.get("rating");
    //           transaction.update(documentRef, { rating: rating - 10 });
    //         }
    //       })
    //     );
    //   });

    //   return Promise.all(promises);
    // });

    // data.winners.forEach(function (player) {
    //   firestore.runTransaction((transaction) => {
    //     const documentRef = firestore.doc("players/" + player._id);
    //     return transaction.get(documentRef).then((doc) => {
    //       if (doc.exists) {
    //         const rating = doc.data().rating;
    //         transaction.set(
    //           documentRef,
    //           { rating: rating + 10 },
    //           { merge: true }
    //         );
    //       }
    //     });
    //   });
    // });

    // data.losers.forEach(function (player) {
    //   firestore.runTransaction((transaction) => {
    //     const documentRef = firestore.doc("players/" + player._id);
    //     return transaction.get(documentRef).then((doc) => {
    //       if (doc.exists) {
    //         const rating = doc.data().rating;
    //         transaction.set(
    //           documentRef,
    //           { rating: rating - 10 },
    //           { merge: true }
    //         );
    //       }
    //     });
    //   });
    // });
  });
