import React, { Component } from 'react'
import { Well, Form, Flex, View, Button, Heading, ProgressBar, Content, ProgressCircle } from '@adobe/react-spectrum'
import TableComponent from './sub-components/TableComponent'
import api from '../services/ApiMap.json'
import AxiosHelper from '../services/AxiosHelper'
import SnackbarNotif from './sub-components/SnackbarNotif'
import { connect } from "react-redux";
import { addResults, removeResults } from "../redux/reducers/pquaResultsSlice"
import { showPquaTableView, hidePquaTableView } from "../redux/reducers/showTableViewSlice"
import label from "@spectrum-css/fieldlabel"
import MUIDatePicker from './sub-components/MUIDatePicker'
import PickerMenu from './sub-components/PickerMenu'
import help from "../resources/Help.json";
import template from "../assets/PQuA 2021 Templates.zip"
import PlatformRadioGroup from './sub-components/PlatformRadioGroup'
import { ManageSession } from '../services/ManageSession'
import { GlaasAuth } from '../services/GlaasAuth';

class ExtractPquaAqbData extends Component {
    
    state = {
        selectedProductName : '',
        selectedPlatform : '',
        startDate : '',
        endDate : '',
        showToastMessage : false,
        toastVariant : '',
        toastMessage : '',
        isFetchButtonDisabled : true,
        fetchingResults : false,
        downloadInProgress : true
    }

    onProductSelection = (selectedKey) => {
        this.setState({
               selectedProductName : selectedKey
        }, () => { this.enableFetchButton() });
    }

    platformSelectionHandler = (selectedKey) => {
        this.setState({
            selectedPlatform : selectedKey
        },() => { this.enableFetchButton() });
        console.log("Selected - "+selectedKey);
    }

    handleDateRange(newDates){
        let startDate = new Date(newDates[0]);
        let endDate = new Date(newDates[1]);

        this.setState(
            {
                startDate : (startDate.getMonth()+1).toString()+"/"+startDate.getDate().toString()+"/"+startDate.getFullYear().toString(),
                endDate : (endDate.getMonth()+1).toString()+"/"+endDate.getDate().toString()+"/"+endDate.getFullYear().toString()
            },
            () => this.enableFetchButton()
        )
    }

    enableFetchButton(){
        if(this.state.selectedProductName !== '' && this.state.startDate !== '' && this.state.endDate !== '' && this.state.selectedPlatform != ''){
            this.setState( { isFetchButtonDisabled : false })
        }
        else {
            this.setState( { isFetchButtonDisabled : true })
        }
    }

    onFetchPquaResults = () => {
        if(ManageSession.ifSessionExpired()) {
            this.setState({
                fetchingResults : false,
                isFetchButtonDisabled : true,
                showToastMessage : true,
                toastMessage : "Session expired - redirecting for authentication",
                toastVariant : 'error'
            },GlaasAuth.authenticate())
        }
        else
        {
            let endpoint = api.pquaAqbApis.pquaResult;
            let authToken = localStorage.getItem('pquaAuthToken');
            console.log("Sending authtoken in params: "+authToken);
            const params = {
                "product_name": this.state.selectedProductName,
                "platform": this.state.selectedPlatform,
                "start_date": this.state.startDate,
                "end_date": this.state.endDate,
                "auth_token": authToken
            }
            let type = 'json';
            this.setState({ fetchingResults : true, showToastMessage : false });
            this.props.hidePquaTableView();
            this.props.removeResults();

            AxiosHelper.postMethodCall(endpoint,params,type)
            .then((response) => {
                if(response.status === 200)
                {
                    this.setState({ 
                        fetchingResults : false,
                        isFetchButtonDisabled : true
                    },this.createTableData);
                    this.props.addResults(params);
                    this.props.showPquaTableView();
                }
            })
            .catch((error) => {
                this.setState({
                    fetchingResults : false,
                    isFetchButtonDisabled : true,
                    showToastMessage : true,
                    toastMessage : "Something went wrong - could not fetch file.",
                    toastVariant : 'error'
                })
            })
        }
    }
    
    downloadPQuASheet = () => {
        let endpoint = api.pquaAqbApis.pquaDownload;
        const params = {
            "product_name": this.props.pquaResults[0].product_name,
            "platform": this.props.pquaResults[0].platform,
            "end_date": this.props.pquaResults[0].end_date
        }
        let type = 'blob';
        let sheetName = this.state.selectedProductName+"PQuA_Data_"+this.state.endDate+".xlsx";

        this.setState({ downloadInProgress : false });
        
        AxiosHelper.postMethodCall(endpoint, params, type)
        .then((response) => {
            this.setState({ downloadInProgress : true });
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', sheetName);
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode.removeChild(link);
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                showToastMessage : true,
                toastMessage : "Something went wrong - could not download file.",
                toastVariant : 'error',
                downloadInProgress : true
            })
        })
    }   

    onSnackbarClose = (e) => {
        this.setState({ showToastMessage : false });
    }

    render() {
        let productList = this.props.productList;

        let subSectionView;
        if(this.props.showTableView.pquaTableView){
            let downloadButton = <Flex direction="row">
                                    <Button variant="cta" isQuiet onPress={this.downloadPQuASheet}>Download</Button>
                                    <ProgressCircle marginStart="size-100" size="S" isIndeterminate isHidden={this.state.downloadInProgress} alignSelf="center"/>
                                </Flex>
            subSectionView = <TableComponent headers={["Product","From Date", "To date", "Download File"]} data={[[this.props.pquaResults[0].product_name+"("+this.props.pquaResults[0].platform+")", this.props.pquaResults[0].start_date, this.props.pquaResults[0].end_date, downloadButton]]}/>
        }
        else if(this.state.fetchingResults)
            subSectionView = <View padding="size-100"><ProgressBar aria-label="Loading results" label="Fetching data... This may take a while." isIndeterminate /></View>
        else if(this.props.showTableView.pquaTableView && this.state.showToastMessage)
            subSectionView = <></>

        let snackbarNotif = <></>;
        if(this.state.showToastMessage)
            snackbarNotif = <SnackbarNotif message={this.state.toastMessage} severity={this.state.toastVariant} handler={this.onSnackbarClose}/>
        
        return(
            <>
                <Well margin="size-800">
                    <Form marginX="size-1000" marginY="size-200">
                        <Heading level={2}>Extract PQuA Data</Heading>
                        <Flex direction="row" gap="size-100">
                            <PickerMenu label="Product" list={productList} selectionHandler={this.onProductSelection}/>
                            <ProgressCircle flexGrow="1" size="S" isIndeterminate alignSelf="end" isHidden={productList.length > 0}/>
                        </Flex>
                        
                        <PlatformRadioGroup value={this.state.selectedPlatform} selectionHandler={this.platformSelectionHandler}/>
                        
                        <Flex
                        direction="row"
                        gap="size-100"
                        alignItems="end"
                        marginTop="size-200">
                            <View>
                            { /*Change this Datepicker implementation after release of Datepicker v3 component*/ }
                            <label for="lifestory" class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">Date range</label>
                                <MUIDatePicker startDate={this.state.startDate} endDate={this.state.endDate} dateHandler={(newDates) => this.handleDateRange(newDates)}  />                                                                                             
                            </View>
                            <Button 
                            variant="cta"
                            isDisabled={this.state.isFetchButtonDisabled}
                            onPress={this.onFetchPquaResults}>
                                Fetch
                            </Button>
                        </Flex>
                        {
                            subSectionView
                        }
                        {
                            snackbarNotif
                        }
                    </Form>
                </Well>
                <Well margin="size-800">
                    <View marginX="size-1000" marginY="size-200">
                        <Heading>
                            What's new in the 2021 PQuA template
                        </Heading>
                        <Content>
                            <ul>
                                <li>
                                    New slides on 
                                    <ul>
                                        <li>
                                        INTL Ready Automation Framework
                                        </li>
                                        <li>
                                        CICLCD with ODIS
                                        </li>
                                        <li>
                                        Customer LOC Bugs Highlight
                                        </li>
                                    </ul>
                                </li>
                                <li>More sample slides added for Functional Testing Double Click</li>
                                <li>Modifications in <i>WR Assessment</i> and <i>Goals</i> slides for action items on Core team</li>
                                <li>New theme and outline in accordance with the new Adobe template</li>
                                <li>Visit the <a href={help.pquaWiki} target="_blank" style={{textDecoration:"none"}}>PQuA wiki</a> for more</li>
                            </ul>
                        </Content>
                        <a href={template} 
                        download="PQuA Template 2021"
                        style={{ textDecoration: 'none' }}>
                            <Button
                            variant="cta"
                            >Download 2021 PQuA Template</Button>
                        </a>    
                    </View>
                </Well>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    pquaResults : state.pquaResults.value,
    showTableView : state.showTableView.value
});

const mapDispatchToProps = { addResults, removeResults, showPquaTableView, hidePquaTableView };

export default connect(mapStateToProps, mapDispatchToProps)(ExtractPquaAqbData);