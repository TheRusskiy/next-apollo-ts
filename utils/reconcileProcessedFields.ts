/* eslint-disable */

// source;
// https://github.com/apollographql/apollo-client/blob/a975320528d314a1b7eba131b97d045d940596d7/src/cache/inmemory/helpers.ts#L95
import { FieldValueToBeMerged } from "@apollo/client/cache/inmemory/helpers"
import { isField, ReconcilerFunction } from "@apollo/client/utilities"

function isFieldValueToBeMerged(
  value: any,
): value is FieldValueToBeMerged {
  const field = value && value.__field;
  return field && isField(field);
}

const reconcileProcessedFields: ReconcilerFunction<any[]> = function (
  existingObject,
  incomingObject,
  property,
) {
  const existing = existingObject[property];
  const incoming = incomingObject[property];

  if (isFieldValueToBeMerged(existing)) {
    existing.__value = this.merge(
      existing.__value,
      isFieldValueToBeMerged(incoming)
        // TODO Check compatibility of __field and __typename properties?
        ? incoming.__value
        : incoming,
    );
    return existing;
  }

  if (isFieldValueToBeMerged(incoming)) {
    incoming.__value = this.merge(
      existing,
      incoming.__value,
    );
    return incoming;
  }

  return this.merge(existing, incoming);
}

export default reconcileProcessedFields

