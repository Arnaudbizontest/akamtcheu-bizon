import React, { Component } from 'react';
import axios from 'axios';


// return a row of the table
// with the commit description and the index
function ResultRow(props) {

	function handleClick(i,e){
		e.preventDefault();
		props.details(i);
	}

	
	if(props.index===props.selectedIndex){
		return (
			<tr>
		    	<td >{props.index+1}</td>
		        <td >
		        	<a className="green" href="#" onClick={(e) => handleClick(props.index, e)}>{props.message}</a>
		        </td>
		        
		      
		    </tr>
	    );

	} else{ 
		return (
			<tr>
		    	<td >{props.index+1}</td>
		        <td >
		        	<a href="#" onClick={(e) => handleClick(props.index, e)}>{props.message}</a>
		        </td>
		        
		      
		    </tr> 
		);
    }
	
}
// return the Table where the data would be displayed
 function ResultTable(props) {

 	 if(props.dataLoaded){
  		return(
			<div className="left_side" style={{ marginTop: 30 }}>
                <h3>Results of the query</h3>
                <table className="table table-striped" style={{ marginTop: 30 }} >
                    <thead>
                        <tr>
                        	<th>N°</th>
                        	<th>Commit description </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.messages.map(function(message,index){ 
                        	return ( <ResultRow message={message} index={index} selectedIndex={props.selectedIndex} key={index} details={props.handleDetail} /> );
		                
                        })}
                    </tbody>
                </table>
            </div>
		);

	} else {
	  	return null;
	}

 }
// display the detail of the selected commit on the table.
 function ResultDetail(props){
 	if(props.detailLoaded){
 		return(
 			<div className="right_side" style={{ marginTop: 30, marginLeft: 40 }}>
 				<h3>Commit details</h3>
 				<div className="author_identity sticky-top">
	 				<div className="avatar"><img src={props.detail.author ? props.detail.author.avatar_url : 'User without avatar'} alt="avatar"/> </div>
	 				<div className="identity">
	 					<p> Author name : {props.detail.commit.committer.name}</p>
	 					<p> Author email : {props.detail.commit.committer.email}</p>
	 					<p> Author GitHub score : {props.detail.score}</p>
	 					<p> Commit date : {new Date(props.detail.commit.committer.date).toUTCString()}</p>
	 				</div>
 				</div>
 			</div>
 			); 	
 	}else {
 		return null;
 	}

 }


//main component return the entire page
export default class Acceuil extends Component {

constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeWord = this.onChangeWord.bind(this);
        this.handleDetail = this.handleDetail.bind(this);
        this.onChangeUser = this.onChangeUser.bind(this);
        
        this.state = {
        	input:"",
        	results: {},
        	dataLoaded : false,
        	detailLoaded: false,
        	messages: [],
        	detail:{},
        	selectedIndex:null,
        	userName:'',

        }
	}


 onSubmit(e) {
        e.preventDefault();

        // format the query to lunch
        let input ='';
        let user='';
        let query='';
        var names = [];

		let test = true;
        input = this.state.input.trim();
        if((input!=='') && (input!= null)){
        	var words = input.split(' ');

        	//adding the key words in the query
        	words.forEach( word => {
	        	if(test){
	        		query=word;
	        		test = false;
	        	}else{
	        		query+='+'+word;
	        	}
        	
        	});
        }

        // handling the user name 
        if(!(this.state.userName === '') && !(this.state.userName == null)){
        	 names = this.state.userName.split(' ');
        	if(names.length>0){
        		user ="+committer-name:"+names[0];
        	}

        	
        }		
        //creating the final query only if one of the field are filled.
        if(input!=='' || names.length>0) {

		        
		        let URL = "https://api.github.com/search/commits?q="+query+user;

		        let config = {
		  			headers: {
		    			"Content-Type" :"application/json",
		    			"Accept" : "application/vnd.github.cloak-preview.v3+json",
		  			}
				}

				axios.get(URL, config).then(response => {

					var messages = [];
					response.data.items.map(function(item,i){
						messages.push(item.commit.message);

					});


					this.setState({
							results: response.data.items,
							dataLoaded:true,
							messages:messages,
							detailLoaded:false,
							selectedIndex:null,
					});


				}

			).catch(error => console.log(error, "SSSSS_ERROR axios request"));

		} else {
			
       		alert("Veuillez renseigner au moins un des deux champs!");

		}


    }

 onChangeWord(e){

  	this.setState({
            input: e.target.value
        });
  }

  onChangeUser(e){

  	this.setState({
            userName: e.target.value
        });
  }

  handleDetail(i){

  	var detail_i = this.state.results[i];

  	this.setState({ 
  		detail:detail_i,
  		detailLoaded:true,
  		selectedIndex:i,

  		
  	});
  	

  }


	render() {
		return (
			<div>
				<h3>Enter the key word(s) and/or an user name of  to look up the different commit into the Github database :</h3>
        	     <form onSubmit={this.onSubmit} >
                    <div className="form-group"> 
                        <input  type="text"
                                className="form-control"
                                placeholder="Key word(s)"
                                value={this.state.input}
                                onChange={this.onChangeWord}
                                />
                    </div>
                    <div className="form-group"> 
                        <input  type="text"
                                className="form-control"
                                placeholder="Enter the user name of the committer"
                                value={this.state.userName}
                                onChange={this.onChangeUser}
                                />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Search" className="btn btn-primary" />
                     </div>
                </form>
                <div className="box_component">
	                <ResultTable dataLoaded={this.state.dataLoaded} messages={this.state.messages} results={this.state.results} 
	                handleDetail={this.handleDetail} selectedIndex={this.state.selectedIndex}/>
	                <ResultDetail detailLoaded={this.state.detailLoaded} detail={this.state.detail}/>
                </div>

                

         	</div>



		);
	}

}