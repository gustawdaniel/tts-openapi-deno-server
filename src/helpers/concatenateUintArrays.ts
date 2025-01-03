export function concatenateUintArrays(
  arr1: Uint8Array,
  arr2: Uint8Array,
): Uint8Array {
  const concatenatedArray = new Uint8Array(arr1.length + arr2.length);
  concatenatedArray.set(arr1);
  concatenatedArray.set(arr2, arr1.length);
  return concatenatedArray;
}
