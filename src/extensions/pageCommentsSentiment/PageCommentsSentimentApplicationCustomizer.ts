import * as React from "react";
import * as ReactDom from 'react-dom';
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'PageCommentsSentimentApplicationCustomizerStrings';
import { SPHttpClientResponse, SPHttpClient } from '@microsoft/sp-http';
import PageCommentsSentiment from './components/PageCommentsSentiment';
import { IPageCommentsSentimentProps } from './components/IPageCommentsSentimentProps';


const LOG_SOURCE: string = 'PageCommentsSentimentApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IPageCommentsSentimentApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class PageCommentsSentimentApplicationCustomizer
  extends BaseApplicationCustomizer<IPageCommentsSentimentApplicationCustomizerProperties> {

    private _headerPlaceholder: PlaceholderContent;
    
    private _baseUrl: string;
    private _listTitle: string;
    private _listServerRelativeUrl: string;
    private _listItemId: number;
    private _getByIdEndpoint: string;
    private _spHttpClient: SPHttpClient;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    // this._initialize();

    // this._isSitePage().then((isSitePage) => {
    //   if (isSitePage) {

    //   }
    // });
    
      // this.context.spHttpClient.get(listItemsUrl, SPHttpClient.configurations.v1).then(
      // (response: SPHttpClientResponse) => {
      //   response.json().then((responseJson: any) => {
      //     console.log(LOG_SOURCE, responseJson);          
      //   })
      // });

    // Added to handle possible changes on the existence of placeholders
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
 
     // Call render method for generating the needed html elements
     this._renderPlaceHolders();
 

    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {
    // Check if the header placeholder is already set and if the header placeholder is available
    if (!this._headerPlaceholder && this.context.placeholderProvider.placeholderNames.indexOf(PlaceholderName.Top) !== -1) {
      this._headerPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, {
        onDispose: this._onDispose
      });

      // The extension should not assume that the expected placeholder is available.
      if (!this._headerPlaceholder) {
        console.error('The expected placeholder (PageHeader) was not found.');
        return;
      }

      if (this._headerPlaceholder.domElement) {
        const element: React.ReactElement<IPageCommentsSentimentProps> = React.createElement(
          PageCommentsSentiment,
          {
            context: this.context
          }
        );
        ReactDom.render(element, this._headerPlaceholder.domElement);
      }
    }
  }    

  private _onDispose(): void {
    console.log('[Breadcrumb._onDispose] Disposed breadcrumb.');
  }

  private _initialize(): void {
    this._spHttpClient = this.context.spHttpClient;
    this._baseUrl = this.context.pageContext.web.absoluteUrl;
    this._listTitle = this.context.pageContext.list ? this.context.pageContext.list.title : null;
    this._listItemId = this.context.pageContext.listItem ? this.context.pageContext.listItem.id : null;
    this._listServerRelativeUrl = this.context.pageContext.list.serverRelativeUrl;
    this._getByIdEndpoint = `${this._baseUrl}/_api/web/lists/GetByTitle('${this._listTitle}')/GetItemById(${this._listItemId})`;
  }

  private async _isSitePage(): Promise<boolean> {
    if (this._listServerRelativeUrl === null || this._listServerRelativeUrl === '') return false;
    if (this._listItemId === null) return false;
    if (this._listTitle === null || this._listTitle === '') return false;
    
    const endpoint = `${this._getByIdEndpoint}/ContentType/Id`;
    const response: SPHttpClientResponse = await this._spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
    const responseJson: any = await response.json();
    const contentTypeId: string = responseJson.StringValue;

    //Modern Page Content Type Id: 0x0101009D1CB255DA76424F860D91F20E6C4118
    return contentTypeId.indexOf('0x0101009D1CB255DA76424F860D91F20E6C4118') >= 0;
  }
}
