# firebase-search-tagger
Sample code to make full text search on firestore document fields:

## Why?
There is no full text search support on firestore on fields. You can use the  third-party search service like Algolia (https://www.algolia.com/). 

I need a solution to search users on 'name' and 'surname'. For this simple feature, I do not want an 3rd party service with payment.

The sample creates partial texts from given strings and use this strings as tags. For example when given  'Yılmaz' as parameter, It creates 'yil', 'yilm', 'yilma', 'yilmaz' as tags. And you can search on those values.

This sample code removes accents, removes white space chars and makes the text lowercased. When you make the search from clients, you should make your keyword also 'no accent' & 'lower cased'.

## Usage sample
```javascript
let tagger = new SearchTagger();
const tags = tagger.searchTagsOf("Cemal", "Yılmaz")
console.log(tags) // >  [ 'cem', 'cema', 'cemal', 'yil', 'yilm', 'yilma', 'yilmaz' ]
```

## Parameters
**minimum:** minimum number of characters to start creating tags. ***Defaults to 3***

**maximum:** maximum number of characters to create tags. ***Defaults to 10***

**removeAccents:** Whether the accents should be removed or not before creating tags. ***Defaults to true***

```javascript
let tagger = new SearchTagger({minimum: 3, maximum:10, removeAccents:true});
```

## onCreate sample
```javascript
exports.onCreateUserSearchHandler = functions.firestore.document('/users/{documentId}')
    .onCreate((snap, context) => {
        let tagger = new SearchTagger();
        let tags = tagger.searchTagsOf(snap.data().name, snap.data().surname);
        return snap.ref.set({ searchTags: tags }, { merge: true });
    })
```

## onUpdate sample
```javascript
exports.onUpdateUserSearchHandler = functions.firestore.document('/users/{documentId}')
    .onUpdate((change, context) => {
        let tagger = new SearchTagger();
        const tags = tagger.searchTagsOf(change.after.data().name, change.after.data().surname)
        return change.after.ref.set({ searchTags: tags }, { merge: true });
    })

