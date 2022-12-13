import React, { Component } from 'react';
import { Well, Form, Flex, View, Button, Heading, Text, ProgressBar, ProgressCircle } from '@adobe/react-spectrum';
import { Cell, Column, Row, TableHeader, TableView, TableBody } from '@adobe/react-spectrum';
import api from '../services/ApiMap.json';
import PickerMenu from './sub-components/PickerMenu';
import TableComponent from './sub-components/TableComponent';
import SnackbarNotif from './sub-components/SnackbarNotif';
import AxiosHelper from '../services/AxiosHelper';
import { connect } from "react-redux";
import { addResults, removeResults } from "../redux/reducers/bugDataResultsSlice"
import { showBugDataTableView, hideBugDataTableView } from "../redux/reducers/showTableViewSlice"
import label from "@spectrum-css/fieldlabel"
import MUIDatePicker from './sub-components/MUIDatePicker'
import PlatformRadioGroup from './sub-components/PlatformRadioGroup';

class ViewBugData extends Component {

    constructor() {
        super();
        this.handleDateRange = this.handleDateRange.bind(this);
    }

    state = {
        productList: [],
        categoryList: [],
        selectedProductName: '',
        selectedPlatform : '',
        selectedCategory: [],
        totalCategoriesSelected: '0 selected',
        startDate: '',
        endDate: '',
        isFetchButtonDisabled: true,
        fetchingResults: false,
        showToastMessage: false,
        toastMessage: '',
        toastVariant: '',
        resourceLoadingError: false
    }

    onProductSelection = (selectedKey) => {
        this.setState({
            selectedProductName: selectedKey
        }, () => { this.enableFetchButton() });
    }

    platformSelectionHandler = (selectedKey) => {
        this.setState({
            selectedPlatform : selectedKey
        },() => { this.enableFetchButton() });
        console.log("Selected - "+selectedKey);
    }

    onCategorySelection = (selectedKeys) => {
        if (typeof (selectedKeys) === "string") {
            this.setState({
                selectedCategory: this.props.categoryList,
                totalCategoriesSelected: this.props.categoryList.length + " selected"
            }, () => { this.enableFetchButton() });            
        }
        else if (selectedKeys.size === 0) {
            this.setState({
                selectedCategory: [],
                totalCategoriesSelected: selectedKeys.size + " selected"
            }, () => { this.enableFetchButton() });
        }
        else {
            let array = [];
            for (const entry of selectedKeys.keys()) {
                array.push(entry);
            }
            this.setState({
                selectedCategory: array,
                totalCategoriesSelected: array.length + " selected"
            }, () => { this.enableFetchButton() });
        }
    }

    enableFetchButton() {
        if (this.state.selectedProductName !== '' && this.state.selectedCategory.length !== 0 && this.state.startDate !== '' && this.state.endDate !== '' && this.state.selectedPlatform != '') {
            this.setState({
                isFetchButtonDisabled: false
            });
        }
        else {
            this.setState({
                isFetchButtonDisabled: true
            });
        }
    }

    handleDateRange(newDates) {
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
    
    onFetchResults = () => {
        let params = {
            "product_name": this.state.selectedProductName,
            "platform": this.state.selectedPlatform,
            "bug_category": this.state.selectedCategory,
            "start_date": this.state.startDate,
            "end_date": this.state.endDate
        }
        this.setState({ fetchingResults: true, showToastMessage: false });
        this.props.hideBugDataTableView()
        this.props.removeResults();

        const selectedProduct = this.state.selectedProductName+"("+this.state.selectedPlatform+")";
        const selectedStartDate = this.state.startDate;
        const selectedEndDate = this.state.endDate;

        AxiosHelper.postMethodCall(api.viewerApis.dataResult, params)
            .then((response) => {
                if (response.status === 200) {
                    for (let dataKey in response.data) 
                    { 
                        const record = {
                            product: selectedProduct,
                            category: dataKey,
                            startDate: selectedStartDate,
                            endDate: selectedEndDate,
                            bugCount: response.data[dataKey].count,
                            jiraLink: response.data[dataKey].link
                        }  
                        this.props.addResults(record);
                    }
                    this.setState({
                        fetchingResults: false,
                        isFetchButtonDisabled: true
                    }, () => this.props.showBugDataTableView());
                }
                else {
                    this.setState({
                        fetchingResults: false,
                        isFetchButtonDisabled: true,
                        showToastMessage: true,
                        toastMessage: "We're facing issues in fetching this data right now. Please try again later.",
                        toastVariant: 'error'
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    fetchingResults: false,
                    isFetchButtonDisabled: true,
                    showToastMessage: true,
                    toastMessage: error,
                    toastVariant: 'error'
                });
            })
    }

    onSnackbarClose = (e) => {
        this.setState({ showToastMessage : false });
    }

    render() {
        let productList = this.props.productList;
        let categoryList = this.props.categoryList;

        let subSectionView;
        if (this.props.showTableView.bugDataTableView)
            subSectionView = <TableComponent headers={["Product", "Bug Category", "From date", "To date", "Bug Count", "Jira Link"]} data={this.props.bugDataResults} />
        else if (this.state.fetchingResults)
            subSectionView = <View><ProgressBar aria-label="Fetching results" label="Fetching results..." labelPosition="top" isIndeterminate /></View>
        else
            subSectionView = <></>

        let snackbarNotif;
        if(this.state.showToastMessage)
            snackbarNotif = <SnackbarNotif message={this.state.toastMessage} severity={this.state.toastVariant} handler={this.onSnackbarClose}/>
        
        return (
            <Well margin="size-800" >
                <Form
                    marginX="size-1000"
                    marginY="size-200" >
                    <Heading level={2}>View Bug Data</Heading>
                    
                    <Flex direction="row" gap="size-100">
                        <PickerMenu label="Product" list={productList} selectionHandler={this.onProductSelection} />
                        <ProgressCircle flexGrow="1" size="S" isIndeterminate alignSelf="end" isHidden={productList.length > 0}/>
                    </Flex>

                    <PlatformRadioGroup value={this.state.selectedPlatform} selectionHandler={this.platformSelectionHandler}/>
                    
                    <label for="lifestory" class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">Bug Categories ({this.state.totalCategoriesSelected})</label>
                    <TableView
                        height="size-3000"
                        aria-label="Example table with dynamic content"
                        selectionMode="multiple"
                        
                        selectedKeys={this.state.selectedCategory}
                        onSelectionChange={(selectedKeys) => this.onCategorySelection(selectedKeys)}
                    >
                        <TableHeader>
                            <Column>Select All</Column>
                        </TableHeader>

                        <TableBody>
                            {
                                categoryList.map(listItem =>
                                    <Row key={listItem}>
                                        <Cell>{listItem}</Cell>
                                    </Row>)
                            }
                        </TableBody>
                    </TableView>

                    <Flex
                        direction="row"
                        gap="size-200"
                        alignItems="end"
                        marginTop="size-200" >
                        <View>
                            <label for="lifestory" class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">Date range</label>
                            <MUIDatePicker startDate={this.state.startDate} endDate={this.state.endDate} dateHandler={(newDates) => this.handleDateRange(newDates)}/>
                        </View>
                        <View>
                            <Button
                                variant="cta"
                                isDisabled={this.state.isFetchButtonDisabled}
                                onPress={this.onFetchResults}>
                                <Text>Fetch</Text>
                            </Button>
                        </View>
                    </Flex>
                    {
                        (this.state.resourceLoadingError && this.state.showToastMessage) ?
                        <SnackbarNotif message={this.state.toastMessage} severity={this.state.toastVariant} handler={this.onSnackbarClose}/>
                            : <></>
                    }
                    {
                        subSectionView
                    }
                    {
                        snackbarNotif
                    }
                </Form>
            </Well>
        );
    }
}

const mapStateToProps = (state) => ({
    bugDataResults : state.bugDataResults.value,
    showTableView : state.showTableView.value
});

const mapDispatchToProps = { addResults, removeResults, showBugDataTableView, hideBugDataTableView };

export default connect(mapStateToProps, mapDispatchToProps)(ViewBugData);