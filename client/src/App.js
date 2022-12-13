import React, { Component } from 'react';
import {Grid, View, IllustratedMessage, Heading, Content, Footer, Link, Flex, ProgressCircle} from '@adobe/react-spectrum';
import HeaderBar from './components/HeaderBar';
import ViewBugData from './components/ViewBugData';
import SidebarMenu from './components/SidebarMenu';
import AddUpdateProduct from './components/AddUpdateProduct';
import ExtractPquaAqbData from './components/ExtractPquaAqbData';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DownloadAqbPods from './components/DownloadAqbPods';
import AxiosHelper from './services/AxiosHelper';
import api from './services/ApiMap.json';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import Unavailable from '@spectrum-icons/illustrations/Unavailable';
import help from "./resources/Help.json";
import { GlaasAuth } from './services/GlaasAuth';
import { ManageSession } from './services/ManageSession';

class App extends Component {

  state = {
    productList : [],
    categoryList : [],
    serverError : false,
    badRequest : false,
    verifyingSession : false
  }

  setUserProductList(responseData){
    let productArray = [];
    responseData.map((entry) => {
      if(entry.productName !== 'All' && !productArray.includes(entry.productName))
        productArray.push(entry.productName);
    })
    this.setState({ productList : productArray })
  }
  
  verifySessionDetails () {
    let authToken = null;
    
    //if redirected after successful authentication
    if(window.location.href.includes("access_token")) {
      console.log("Redirection complete, extracting authToken");
      authToken = GlaasAuth.parseUriWithHash(window.location.href);
    }
    else {
      //if authToken is already saved
      if(localStorage.getItem('pquaAuthToken') != null && localStorage.getItem('pquaAuthTokenExpires') != null){
        authToken = localStorage.getItem("pquaAuthToken");
        console.log("Extracted authToken from storage")
        
        if(ManageSession.ifSessionExpired()) {
          console.log("Session expired, calling initiate()")
          GlaasAuth.authenticate();
        }
      }
      //if first log in to the app
      else{
        console.log("Initiating auth workflow");
        GlaasAuth.authenticate();
      }
    }

    console.log("Performing checkSession call")
    GlaasAuth.checkSession(authToken)
    .then((response) => {
        console.log("Saving validated authToken, expiration time, and user details")
        localStorage.setItem('pquaAuthToken', authToken);
        localStorage.setItem('pquaAuthTokenExpires', response.expiresOn);
        localStorage.setItem('userLdap',response.ldap);
        localStorage.setItem('userName', response.name);
        localStorage.setItem('userEmail', response.email);
        console.log("Fetching data for app");
        this.fetchProductsAndCategories();
    })
    .catch((error) => {
        console.log(error);
        console.log("Removing user info from localStorage")
        localStorage.clear();
    })
  }
  

  fetchProductsAndCategories(){
    let categoryListArray = [];
    //Fetching all products
    let authToken = localStorage.getItem("pquaAuthToken");

    if(authToken != null){
      AxiosHelper.glaasGetMethodCall(api.glaasUrl+api.glaasProductApi,{ headers : { "accept": "application/json", "Authorization" : api.clientId+":"+authToken }})
      .then((response) => {
        if(response.status === 200) {
          this.setUserProductList(response.data);
          
          this.setState({
            verifyingSession : false
          })
        }
        else if(response.status == 401) {
          console.log();
          this.setState({
            badRequest : true,
            verifyingSession : false
          })
        }
      })       
      .catch((error) => {
        console.log(error);
        this.setState({
          serverError : true,
          verifyingSession : false
        })
      })
    }

    //Fetching all categories
    AxiosHelper.getMethodCall(api.viewerApis.allBugCategories,{ headers : { "accept": "application/json" }})
      .then((response) => {
        if (response.status === 200) {
            response.data.map((category) => {
            categoryListArray.push(category[1]);
          })
          this.setState({
            categoryList : categoryListArray,
          })
        }
        else if(response.status == 400) {
          console.log();
          this.setState({
            badRequest : true
          })
        }
    })       
    .catch((error) => {
      console.log(error);
      this.setState({
        serverError : true
      })
    })

  }

  componentDidMount(){
    //this.verifySessionDetails();
    this.fetchProductsAndCategories();
  }

  renderAppContent(){
    if(this.state.serverError || this.state.badRequest){
      return (
        <View>
          <IllustratedMessage>
            <NotFound/>
            <Heading>Unable to Connect</Heading>
              <Content>
                Unable to load data. Please check with the admin.
              </Content>
          </IllustratedMessage>
        </View>
      )
    }
    else {
      if(this.state.verifyingSession){
        return(
          <Flex direction="row" gap="size-100" alignSelf="center" justifySelf="center">
            <ProgressCircle alignSelf="center" size='M'isIndeterminate/>
            <Heading level={1}>Verifying session details...</Heading>
          </Flex>
        )
      }
      else{
        return (
          <View backgroundColor="gray-75" gridArea="content">
            <Switch>
              <Route path="/pqua" exact render={(props) => <ExtractPquaAqbData productList = {this.state.productList} /> } />
              <Route path="/download-pods" exact component={ (props) => <DownloadAqbPods productList = {this.state.productList}/> } />
              <Route path="/bug-data" exact component={ (props) => <ViewBugData productList = {this.state.productList} categoryList = {this.state.categoryList}/> } />
              <Route path="/add-update-queries" exact render={(props) => <AddUpdateProduct productList = {this.state.productList} categoryList = {this.state.categoryList} />} />
              <Route path="/pqua-data" exact render={(props) => <ExtractPquaAqbData productList = {this.state.productList} /> } />
            </Switch>
          </View>
        )
      }                
    }
  }

  render()
  {    
    return (
      <Router>
        <Grid
          areas={['sidebar content', 'footer footer']}
          columns={['1fr', '5fr']}
          rows={['15fr', '0.5fr']}
          height={window.innerHeight}>
            <View backgroundColor="gray-200" gridArea="sidebar">
            <SidebarMenu/>
            </View>
            {
              this.renderAppContent()
            }
          <View backgroundColor="gray-100" gridArea="footer" justifySelf="center" margin="size-50">
            <Footer >
              <Flex 
              direction="row"
              gap="size-100">
                <Link isQuiet>
                  <a href={help.faqsPage} target="_blank">
                  Help 
                  </a>
                </Link>
                <Link isQuiet>
                  <a href={help.pquaWiki} target="_blank">
                  Wiki
                  </a>
                </Link>
                <Link
                isQuiet
                onPress={(e) => {
                  window.location = help.pquaGrpEmail
                }}>
                  Contact Us
                </Link>
              </Flex>
            </Footer>
          </View>
      </Grid>
      </Router>
    );
  }
}
//<Route path="/productconfig" exact component={ AddUpdateProduct } />
export default App;
