import { CustomError } from "../errors";

class EntityNotFoundError extends CustomError<ErrorCode> {}
export default EntityNotFoundError;
