import { IPageComment } from "../model/IPageComment";

export interface IPageCommentsSentimentState {
    isSitePage: boolean;
    comments: IPageComment[];
}