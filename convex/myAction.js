import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { action } from "./_generated/server.js";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    await ConvexVectorStore.fromTexts(
      args.splitText,
      {
        fileId: args.fileId,
      },
      new GoogleGenerativeAIEmbeddings({
        apiKey: "AIzaSyB0RHqDiqoB8raF8jVypt1T3FgaryiZMpI",
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );
    return "Completed...";
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: "AIzaSyB0RHqDiqoB8raF8jVypt1T3FgaryiZMpI",
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );
    console.log(vectorStore, "vectorStore");

    const resultOne = await vectorStore.similaritySearch(args.query, 1);

    const filteredResults = resultOne.filter(
      (q) => q.metadata.fileId === args.fileId
    );

    return JSON.stringify(filteredResults);
  },
});