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

    return firestore.runTransaction(async (transaction) => {
      const docRefs = [];
      data.winners.forEach(function (player) {
        docRefs.push(firestore.doc("players/" + player._id));
      });
      data.losers.forEach(function (player) {
        docRefs.push(firestore.doc("players/" + player._id));
      });
      return transaction.getAll(...docRefs).then((docs) => {
        docs.forEach((doc) => {
          if (doc.exists) {
            const rating = doc.data().rating;
            let isInWinners = false;
            data.winners.forEach(function (player) {
              if (player._id == doc.id) {
                isInWinners = true;
              }
            });
            if (isInWinners) {
              transaction.update(doc.ref, { rating: rating + 10 });
            } else {
              transaction.update(doc.ref, { rating: rating - 10 });
            }
          }
        });
      });
    });
  });
