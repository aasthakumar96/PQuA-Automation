import React, {Component} from 'react'
import { Form, Button, ActionButton, Well, Flex, View, Heading, ProgressCircle, TextArea, Tooltip, TooltipTrigger, ProgressBar, Content, Header } from '@adobe/react-spectrum'
import Edit from '@spectrum-icons/workflow/Edit'
import api from '../services/ApiMap.json'
import PickerMenu from './sub-components/PickerMenu'
import AxiosHelper from '../services/AxiosHelper'
import SnackbarNotif from "./sub-components/SnackbarNotif"
import PlatformRadioGroup from "./sub-components/PlatformRadioGroup"
import {RadioGroup, Radio} from '@adobe/react-spectrum'

class AddUpdateProduct extends Component {

    constructor(props) {
        super(props);
    }
    
    state = {
        selectedProduct : '',
        selectedPlatform : '',
        selectedCategory : '',
        jqlValue : '',
        jqlLastModifiedBy : '',
        editButtonDisabled : true,
        jqlFieldEditingDisabled : true,
        addUpdateButtonDisabled : true,
        fetchingResponse : false,
        processingSubmissionFlag : false,
        showToastMessageMessage : false,
        toastVariant : '',
        toastMessage : '',
        submissionbuttonID : '',
        resourceLoadingError : false,
        isAddButtonDisabled : true,
        jqlExistsForProductAndCategory : true
    }
    
    jqlSubmissionHandler = (event) => {
        let params = {
            "product_name": this.state.selectedProduct,
            "platform": this.state.selectedPlatform,
            "bug_category": this.state.selectedCategory,
            "jql_query": this.state.jqlValue,
            "modified_by": localStorage.getItem('userLdap')
        }

        this.setState( 
        {
            showToastMessage : false,
            processingSubmissionFlag : true,
            addUpdateButtonDisabled : true,        
        })

        AxiosHelper.postMethodCall(api.iqeApis.postJql,params)
        .then((response) => {
            if (response.status === 200){
                this.setState( { 
                    processingSubmissionFlag : false,
                    jqlFieldEditingDisabled : true,
                    editButtonDisabled : false,
                    showToastMessage : true,
                    toastMessage : response.data["message"],
                    toastVariant : "success",
                    jqlLastModifiedBy : response.data["modified_by"]
                })
            }
            else{
                this.setState( { 
                    processingSubmissionFlag : false,
                    jqlFieldEditingDisabled : true,
                    editButtonDisabled : false,
                    showToastMessage : true,
                    toastMessage : response.data,
                    toastVariant : 'error',
                    jqlLastModifiedBy : ''
                })
            }
        })
        .catch((error) => {
            this.setState( { 
                processingSubmissionFlag : false,
                jqlFieldEditingDisabled : true,
                editButtonDisabled : false,
                showToastMessage : true,
                toastMessage : error,
                toastVariant : 'error',
                jqlLastModifiedBy : ''
            })
        })       

    }

    jqlEditButtonHandler = () => {
        this.setState({
                editButtonDisabled : true, 
                jqlFieldEditingDisabled : false,
                jqlExistsForProductAndCategory : true
            });
    }

    fetchExistingJQL() {
        if (this.state.selectedProduct !== '' && this.state.selectedCategory !== '' && this.state.selectedPlatform != '')
        {
            this.setState({ 
                fetchingResponse : true, 
                showToastMessage : false 
            })

            const params = {
                "product_name": this.state.selectedProduct,
                "platform": this.state.selectedPlatform,
                "bug_category": this.state.selectedCategory
            }
            
            AxiosHelper.postMethodCall(api.iqeApis.fetchJQL,params)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState( { 
                        jqlValue : response.data["jql_string"],
                        jqlLastModifiedBy : response.data["modified_by"],
                        editButtonDisabled : false,
                        fetchingResponse : false,
                        jqlExistsForProductAndCategory : true
                    })
                }
                else if(response.status === 400 || response.status === 206)
                {
                    this.setState( { 
                        jqlValue : '',
                        jqlLastModifiedBy : '',
                        editButtonDisabled : false,
                        fetchingResponse : false,
                        jqlExistsForProductAndCategory : false,
                        showToastMessage : true,
                        toastMessage : response.data,
                        toastVariant : 'info'
                    })
                }
            })
            .catch((error) => {
                this.setState( { 
                    jqlValue : '',
                    jqlLastModifiedBy : '',
                    editButtonDisabled : false,
                    fetchingResponse : false,
                    jqlExistsForProductAndCategory : false,
                    showToastMessage : true,
                    toastMessage : error,
                    toastVariant : 'error',
                    
                })
            })
        }
    }

    productSelectionHandler = (selectedKey) => {
        this.setState({
                selectedProduct : selectedKey
            },() => { this.fetchExistingJQL() });
    }

    platformSelectionHandler = (selectedKey) => {
        this.setState({
            selectedPlatform : selectedKey
        },() => { this.fetchExistingJQL() });
    }

    categorySelectionHandler = (selectedKey, caller) => {
        this.setState({ 
            selectedCategory : selectedKey
        }, () => { this.fetchExistingJQL() });
    }

    onSnackbarClose = (e) => {
        this.setState({ showToastMessage : false });
    }

    render() {
        let productList = this.props.productList;
        let categoryList = this.props.categoryList;
        let toastLoaderView;

        if(this.state.showToastMessage){
            toastLoaderView = <SnackbarNotif message={this.state.toastMessage} severity={this.state.toastVariant} handler={this.onSnackbarClose}/>
        }
        else if (this.state.processingSubmissionFlag){
            toastLoaderView = <View>
                <ProgressBar label="Loading…" isIndeterminate />
            </View>
        }
        else {
            toastLoaderView = <></>
        }

        return(
            <Well margin="size-800">
                <Form marginX="size-1000" marginY="size-200">
                    
                    <Heading level={2}>Add/Update Product Queries</Heading>
                    <Flex direction="row" gap="size-100">
                        <PickerMenu label="Product" list={productList} selectionHandler={this.productSelectionHandler}/>
                        <ProgressCircle flexGrow="1" size="S" isIndeterminate alignSelf="end" isHidden={productList.length > 0}/>
                    </Flex>

                    <PlatformRadioGroup value={this.state.selectedPlatform} selectionHandler={this.platformSelectionHandler}/>
                    
                    <PickerMenu label="Bug Category" list={categoryList} selectionHandler={this.categorySelectionHandler}/>
                    
                    <Flex 
                    direction="row"
                    gap="size-100"
                    alignItems="end">
                        
                            <TextArea
                                label="Enter/Update JQL"
                                flexGrow="400"
                                minWidth="size-600"
                                isReadOnly={this.state.jqlFieldEditingDisabled} 
                                value={this.state.jqlValue}
                                onChange={ value => {
                                    if(value.length !== 0)
                                    {
                                        this.setState({ 
                                            addUpdateButtonDisabled : false,
                                            jqlValue : value
                                        })
                                    }
                                    else {
                                        this.setState({ 
                                            addUpdateButtonDisabled : true,
                                            jqlValue : value
                                        })
                                    }
                                } 
                                }/>
                        
                        <View
                        flexGrow="1">
                            {
                                this.state.fetchingResponse ? <ProgressCircle aria-label="Loading…" size="M" isIndeterminate /> :
                                <TooltipTrigger>
                                        <ActionButton 
                                            alignSelf="flex-end"
                                            isDisabled={this.state.editButtonDisabled} 
                                            onPress={this.jqlEditButtonHandler}> 
                                            <Edit /> 
                                        </ActionButton>
                                    <Tooltip>Edit JQL</Tooltip>
                                </TooltipTrigger>
                            }
                        </View>
                    </Flex>
                    <label for="lifestory" class="spectrum-FieldLabel spectrum-FieldLabel--sizeM" style={{fontStyle: "italic"}} hidden={this.state.jqlLastModifiedBy === null}>Last modified by: {this.state.jqlLastModifiedBy}</label>
                    { toastLoaderView }
                    <View>
                            <Button
                            variant="cta" 
                            marginTop="size-200"
                            onPress={this.jqlSubmissionHandler}
                            isDisabled={this.state.addUpdateButtonDisabled} >
                            { this.state.jqlExistsForProductAndCategory ? "Update" : "Add" }
                            </Button>
                    </View>
                    <br/>
                    <View>
                        <span style={{fontStyle: 'italic'}} >
                            <Header><b>Instructions</b></Header>
                            <Content>
                                1. Verify the query before submitting.<br/>
                                2. Do not include date filters in the query.<br/>
                                3. 'issueType = Bug' or 'type = Bug' is a mandatory filter.<br/>
                            </Content>
                        </span>
                    </View>
                </Form>
            </Well>   
        )
    }
}

export default AddUpdateProduct;
