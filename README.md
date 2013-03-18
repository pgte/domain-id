# domain-id

Assigns an ID to a domain.

Propagates IDs across requests.

## Install

```bash
$ npm install domain-id
```

## Use

You just need to require `domain-id`:

```javascript
require('domain-id');
```

You will then have `domain._id` accessible in your domain objects. This id will automatically propagate across your HTTP requests.

## Licence

MIT