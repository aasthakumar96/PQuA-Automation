import React, {Component} from 'react';
import { Well,Button, Form, Text, Content, ButtonGroup, View, Flex, ActionButton, Item, Menu, TooltipTrigger, Tooltip, ProgressBar } from '@adobe/react-spectrum';
import {Grid, GridColumn, GridRow} from '@react/react-spectrum/Grid';
import MultiPickerMenu from './MultiPickerMenu';
import Datepicker from '@react/react-spectrum/Datepicker';
import Provider from '@react/react-spectrum/Provider';
import ComboBox from '@react/react-spectrum/ComboBox';
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import { Accordion, AccordionItem } from '@react/react-spectrum/Accordion';
import AxiosHelper from '../../services/AxiosHelper';
import Axios from 'axios';
import api from '../../services/ApiMap.json';
import MixedCharts from './MixedCharts';
import Chart from 'react-google-charts';

class CustomAqbPods extends Component{
    constructor(props) {
        super(props);
    }

    state = {
        selectedProducts : [],
        startDate : '',
        endDate : '',
        comboInputValue : '',
        selectedComboKey : '',
        isAddButtonDisabled : true,
        isGenerateButtonDisabled : true,
        duplicateProductSelected : false,
        generatingPods : false,
        plotAqbPods : false,
        dataToPlot : []
    }

    productSelectionHandler(selected){
        this.setState({ 
            selectedComboKey : selected,
            isAddButtonDisabled : false
        });
    }

    dateRangeSelectionHandler(selected){
        this.setState({ 
            startDate : selected.start,
            endDate : selected.end
         }, () => { this.enableGenerateButton() });
    }

    onInputChange(value){
        this.setState({ comboInputValue : value })
    }

    addProductToList = (event) => {
        if(this.state.selectedProducts.includes(this.state.comboInputValue))
        {
            this.setState(
                {
                    isAddButtonDisabled : true,
                    selectedComboKey : '',
                    comboInputValue: '',
                    duplicateProductSelected: true
                }
            )
        }
        else{
            let arrayOfProducts = this.state.selectedProducts;
            arrayOfProducts.push(this.state.selectedComboKey);

            this.setState(
                {
                    selectedProducts : arrayOfProducts,
                    isAddButtonDisabled : true,
                    selectedComboKey : '',
                    comboInputValue: '',
                    duplicateProductSelected: false
                }, () => { this.enableGenerateButton() }
            )
        }
    }

    removeSelectedProduct(productToRemove){
        let selectedProductsArray = this.state.selectedProducts;
        let index;
        for(index=0; index<selectedProductsArray.length; index++){
            if(selectedProductsArray[index] === productToRemove)
                break;
        }
        selectedProductsArray.splice(index,1);
        this.setState({ selectedProducts : selectedProductsArray }, () => { this.enableGenerateButton() } );
        /*let index=0;
        this.state.selectedProducts.map((product) => {
            if(product === productToRemove){
                break;
            }
            else{
                index+=1;
            }
        })
        this.state.selectedProducts.splice(index,1);*/
    }

    enableGenerateButton(){
        if(this.state.selectedProducts.length > 0 && this.state.startDate != '' && this.state.endDate != '')
        {
            this.setState({ isGenerateButtonDisabled : false });
        }
        else if(this.state.selectedProducts.length === 0)
        {
            this.setState({ isGenerateButtonDisabled : true });
        }
    }

    generateCustomPods = (event) => {
        this.setState(
            {
                isGenerateButtonDisabled : true,
                generatingPods : true,
                plotAqbPods : false
            }
        )
        let params = {
                "product_name": this.state.selectedProducts,
                "start_date": this.state.startDate,
                "end_date": this.state.endDate
        }

        AxiosHelper.postMethodCall(api.pquaAqbApis.aqbPods, params)
        .then((response) => {
            if(response.status === 200)
            {
                this.plotCustomPods(response.data);
            }
        })
        .catch((error) => {
            console.log("Error encountered : "+ error);
            this.setState( { generatingPods : false } )
        })
    }

    plotCustomPods(responseData){
        let chartData, lowerBand, upperBand;
        
        for(let category in responseData){
            chartData = [];
            if(category === "Loc Fixed")
            {
                chartData.push(["Product", "Loc Fixed%", "English Fixed%", "Upper band", "Lower band"]);
                responseData[category]["Data"].map((productData) => {
                    chartData.push([productData.Product, productData.Values["Loc Bugs- Fixed"], productData.Values["English"], 80, 70]);
                });
            }
            else if(category === "Loc Deferred")
            {
                chartData.push(["Product", "Loc Deferred%", "English Deferred%", "Upper band", "Lower band"]);
                responseData[category]["Data"].map((productData) => {
                    chartData.push([productData.Product, productData.Values["Loc Bugs - Deferred"], productData.Values["English"], 80, 70]);
                });
            }
            responseData[category]["Data"] = chartData;
        }
        this.setState({ dataToPlot : responseData, plotAqbPods : true, generatingPods : false });
    }

    render()
    {
        let platforms = ["Web", "Desktop", "Mobile(iOS)", "Mobile(Android)"];
        return(
            <Well>
                <Form 
                marginX="size-100" 
                marginY="size-200"
                >
                    <Flex gap="size-100" and direction="row" alignItems="end">
                        <View>
                            <label for="custom-pods-product-selection" class="spectrum-FieldLabel">Select products</label>
                            <Provider>
                                <ComboBox
                                    aria-label="Default"
                                    disabled={false}
                                    invalid={false}
                                    value={this.state.comboInputValue}
                                    onChange={(value) => this.onInputChange(value)}
                                    onSelect={(selected) => this.productSelectionHandler(selected)}
                                    options={this.props.productList}
                                    quiet={false}
                                    required={false}
                                />
                            </Provider>
                        </View>
                        <View>
                            <TooltipTrigger isOpen={this.state.duplicateProductSelected}>
                                <ActionButton
                                isDisabled={this.state.isAddButtonDisabled}
                                onPress={this.addProductToList}>
                                    Add
                                </ActionButton>
                                <Tooltip variant="negative">Duplicate selection is not allowed!</Tooltip>
                            </TooltipTrigger>
                        </View>
                        <View marginStart="size-200">
                            <label for="custom-pods-date-range" class="spectrum-FieldLabel">Select duration</label>
                            <Provider>
                                <Datepicker
                                    aria-label="Date range"
                                    headerFormat="MMMM YYYY"
                                    max={"today"}
                                    min={null}
                                    placement="bottom"
                                    quiet={false}
                                    required={true}
                                    selectionType="range"
                                    startDay={0}
                                    type="date"
                                    onChange={(selected) => this.dateRangeSelectionHandler(selected)} />
                            </Provider>
                        </View>
                        <View marginStart="size-100">
                            <Button marginTop="size-200" variant="cta" isDisabled={this.state.isGenerateButtonDisabled} onPress={this.generateCustomPods}>Generate pods</Button>
                        </View>
                    </Flex>
                    {
                        this.state.selectedProducts.length > 0 ?
                        <Provider>
                            <Accordion
                            aria-label="nested ComboBox"
                            ariaLevel={3}
                            defaultSelectedIndex={0}
                            multiselectable={false}
                            onChange={function noRefCheck(){}}>
                                <AccordionItem
                                disabled={false}
                                header="Selected Products"
                                onItemClick={function noRefCheck(){}}
                                selected={false}>
                                    <Menu>
                                    {
                                        this.state.selectedProducts.map((product) => 
                                        <Item key={product}>
                                            <ActionButton aria-label="Remove product" isQuiet onPress={() => this.removeSelectedProduct(product)}>
                                                    <RemoveCircle size="S"/>
                                            </ActionButton>
                                            <Text marginStart="size-250">{product}</Text>    
                                        </Item>)
                                    }
                                    </Menu>
                                </AccordionItem>
                            </Accordion>
                        </Provider>
                        :
                        <>
                        </>
                    }
                    {
                        this.state.generatingPods?
                        <View>
                            <ProgressBar
                            aria-label="Loading"
                            label="Fetching data... This may take a while."
                            isIndeterminate
                            />
                        </View>
                        :
                        <></>
                    } 
                    {
                        this.state.plotAqbPods ?
                        <Provider>
                                <Grid variant="fluid">
                                    <GridRow>
                                        <GridColumn size={5}>
                                            <MixedCharts data={this.state.dataToPlot['Loc Fixed']['Data']} title={"Adobe Quality Band : Loc Fixed% : " + this.state.dataToPlot['Loc Fixed']['Lower band'] + " - " + this.state.dataToPlot['Loc Fixed']['Upper band']} lowerBandColor="#0ba34d" upperBandColor="#b80909"/>
                                        </GridColumn>
                                        <GridColumn size={5}>
                                            <MixedCharts data={this.state.dataToPlot['Loc Deferred']['Data']} title={"Adobe Quality Band : Loc Deferred% : " + this.state.dataToPlot['Loc Deferred']['Lower band'] + " - " + this.state.dataToPlot['Loc Deferred']['Upper band']} lowerBandColor="#b80909" upperBandColor="#0ba34d"/>
                                        </GridColumn>
                                        <GridColumn size={5}>
                                            <MixedCharts data={this.state.dataToPlot['Loc Deferred']['Data']} title={"Adobe Quality Band : Loc Deferred% : " + this.state.dataToPlot['Loc Deferred']['Lower band'] + " - " + this.state.dataToPlot['Loc Deferred']['Upper band']} lowerBandColor="#b80909" upperBandColor="#0ba34d"/>
                                        </GridColumn>
                                    </GridRow>
                                    <GridRow>
                                        <GridColumn size={4} offsetSize={9}>
                                            <Button variant="cta">Download pods</Button>
                                        </GridColumn>
                                    </GridRow>
                                </Grid>
                            </Provider>
                        :
                        <></>
                    }
                </Form>
            </Well>
        )
    }
}

export default CustomAqbPods;

{/*<Grid columns={['1fr', '1fr']} gap="size-200">
                                <View backgroundColor="orange-400">
                                    <MixedCharts data={this.state.dataToPlot['Loc Fixed']['Data']} title={"Adobe Quality Band : Loc Fixed% : " + this.state.dataToPlot['Loc Fixed']['Lower band'] + " - " + this.state.dataToPlot['Loc Fixed']['Upper band']} lowerBandColor="#0ba34d" upperBandColor="#b80909"/>
                                </View>
                                <View backgroundColor="red-400">
                                    <MixedCharts data={this.state.dataToPlot['Loc Deferred']['Data']} title={"Adobe Quality Band : Loc Deferred% : " + this.state.dataToPlot['Loc Deferred']['Lower band'] + " - " + this.state.dataToPlot['Loc Deferred']['Upper band']} lowerBandColor="#b80909" upperBandColor="#0ba34d"/>
                                </View>
                                <View backgroundColor="red-400">
                                    <MixedCharts data={this.state.dataToPlot['Loc Deferred']['Data']} title={"Adobe Quality Band : Loc Deferred% : " + this.state.dataToPlot['Loc Deferred']['Lower band'] + " - " + this.state.dataToPlot['Loc Deferred']['Upper band']} lowerBandColor="#b80909" upperBandColor="#0ba34d"/>
                                </View>
                                <View backgroundColor="seafoam-700" justifySelf="right">
                                    <Button variant="cta">Download pods</Button>
                                </View>
                    </Grid>*/}

                    {/*
                        <Provider>
                                <Grid variant="fluid">
                                    <GridRow>
                                        <GridColumn size={5}>
                                            
                                                <MixedCharts data={this.state.dataToPlot['Loc Fixed']['Data']} title={"Adobe Quality Band : Loc Fixed% : " + this.state.dataToPlot['Loc Fixed']['Lower band'] + " - " + this.state.dataToPlot['Loc Fixed']['Upper band']} lowerBandColor="#0ba34d" upperBandColor="#b80909"/>
                                            
                                        </GridColumn>
                                        <GridColumn size={5}>
                                            
                                                <MixedCharts data={this.state.dataToPlot['Loc Deferred']['Data']} title={"Adobe Quality Band : Loc Deferred% : " + this.state.dataToPlot['Loc Deferred']['Lower band'] + " - " + this.state.dataToPlot['Loc Deferred']['Upper band']} lowerBandColor="#b80909" upperBandColor="#0ba34d"/>
                                            
                                        </GridColumn>
                                    </GridRow>
                                    <GridRow>
                                        <GridColumn size={5}>
                                            <Button variant="cta">Download pods</Button>
                                        </GridColumn>
                                        <GridColumn size={5}>
                                            <Button variant="cta">Download pods</Button>
                                        </GridColumn>
                                    </GridRow>
                                </Grid>
                            </Provider>
                    */}