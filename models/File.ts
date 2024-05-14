import { model, Schema, models } from "mongoose";

interface IFile {
  url: string;
  clerkId: string;
}

const fileSchema = new Schema<IFile>({
  url: { type: String, required: true },
  clerkId: { type: String, required: true },
});

const File = models.File || model<IFile>("File", fileSchema);

export default File;
