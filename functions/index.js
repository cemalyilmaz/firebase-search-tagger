const functions = require('firebase-functions');
const SearchTagger = require('./SearchTagger');

exports.onUpdateUserSearchHandler = functions.firestore.document('/users/{documentId}')
    .onUpdate((change, context) => {
        // let tagger = new SearchTagger({minimum: 3, maximum:10, removeAccents:true});
        let tagger = new SearchTagger();
        const tags = tagger.searchTagsOf(change.after.data().name, change.after.data().surname)
        return change.after.ref.set({ searchTags: tags }, { merge: true });
    })

exports.onCreateUserSearchHandler = functions.firestore.document('/users/{documentId}')
    .onCreate((snap, context) => {
        let tagger = new SearchTagger();

        let tags = tagger.searchTagsOf(snap.data().name, snap.data().surname);
        return snap.ref.set({ searchTags: tags }, { merge: true });
    })

