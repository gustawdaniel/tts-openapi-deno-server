import { assertEquals } from "@std/assert/equals";
import { concatenateUintArrays } from "./concatenateUintArrays.ts";

Deno.test(function concatenateUintArraysTest() {
  const array1 = new Uint8Array([1, 2, 3]);
  const array2 = new Uint8Array([4, 5, 6]);
  const result = concatenateUintArrays(array1, array2);

  assertEquals(result, new Uint8Array([1, 2, 3, 4, 5, 6]));
});
