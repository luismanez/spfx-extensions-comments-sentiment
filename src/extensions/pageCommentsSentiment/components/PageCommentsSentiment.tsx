import * as React from "react";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { IPageCommentsSentimentProps } from "./IPageCommentsSentimentProps";
import { IPageCommentsSentimentState } from "./IPageCommentsSentimentState";
import { Icon } from 'office-ui-fabric-react/lib/Icon';

import styles from './PageCommentsSentiment.module.scss';

export default class PageCommentsSentiment extends React.Component<IPageCommentsSentimentProps, IPageCommentsSentimentState> {

    constructor(props: IPageCommentsSentimentProps) {
        super(props);

        // Initiate the component state
        this.state = {
            comments: [],
            isSitePage: false
        };
    }

    public render(): React.ReactElement<IPageCommentsSentimentProps> {
        return (
            <div className={styles.PageCommentsSentiment} >
                <Icon iconName='AddEvent' className='ms-IconExample' />
            </div >
        );
    }
}