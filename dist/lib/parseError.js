"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodErrors = void 0;
exports.parseError = parseError;
const zod_1 = require("zod");
const formatZodErrors = (error) => Object.fromEntries(error.issues.map((e) => [e.path.join("."), e.message]));
exports.formatZodErrors = formatZodErrors;
function parseError(error) {
    if (error instanceof zod_1.ZodError) {
        return error.issues.map((e) => e.message).join(", ");
    }
    return "Error desconocido";
}
