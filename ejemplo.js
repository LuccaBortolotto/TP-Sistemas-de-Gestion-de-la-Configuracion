/**
 * Suma dos números.
 * @param {number} a - Primer número.
 * @param {number} b - Segundo número.
 * @returns {number} La suma de a y b.
 */
function sumar(a, b) {
  try {
    return a + b;
  } catch (error) {
    console.error('Error al sumar los valores:', error);
    return 0;
  }
}
