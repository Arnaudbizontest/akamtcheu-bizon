import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import axios from 'axios';


function ResultRow(props) {

	function handleClick(i,e){
		e.preventDefault();
		console.log("click" + i);
		props.details(i);
	}

	return (

	<tr>
    	<td >{props.index+1}</td>
        <td>
        	<a href="#" onClick={(e) => handleClick(props.index, e)}>{props.message}</a>
        </td>
        
      
    </tr> 
	);
}

 function ResultTable(props) {

 	 if(props.dataLoaded){
 	 	console.log("ok");
  		return(
			<div className="left_side" style={{ marginTop: 30 }}>
                <h3>Results of the query</h3>
                <table className="table table-striped" style={{ marginTop: 30 }} >
                    <thead>
                        <tr>
                        	<th>N°</th>
                        	<th>Commit message description </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.messages.map(function(message,index){ 
                        	console.log(index,'SSSSS____INDEX2V2V2');
                        	console.log(message,'SSSSS____MESSAGEV2V2V2');
                        	return ( <ResultRow message={message} index={index} key={index} details={props.handleDetail} /> );
		                
                        })}
                    </tbody>
                </table>
            </div>
		);

	} else {
		console.log("KO");
	  	return null;
	}

 }

 function ResultDetail(props){
 	if(props.detailLoaded){
 		return(
 			<div className="right_side" style={{ marginTop: 30, marginLeft: 40 }}>
 				<h3>Commit details</h3>
 				<div className="author_identity">
	 				<div className="avatar"><img src={props.detail.author ? props.detail.author.avatar_url : 'User without avatar'} alt="avatar"/> </div>
	 				<div className="identity">
	 					<p> Author name : {props.detail.commit.committer.name}</p>
	 					<p> Author email : {props.detail.commit.committer.email}</p>
	 					<p> Author GitHub score : {props.detail.score}</p>
	 					<p> Commit date : {props.detail.commit.committer.date.toString()}</p>
	 				</div>
 				</div>
 			</div>
 			); 	
 	}else {
 		return null;
 	}

 }



export default class Acceuil extends Component {

constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeWord = this.onChangeWord.bind(this);
        this.handleDetail = this.handleDetail.bind(this);
        // this.resultList = this.resultList.bind(this);
        this.state = {
        	input:"",
        	results: {},
        	dataLoaded : false,
        	detailLoaded: false,
        	messages: [],
        	detail:{}

        }
	}


 onSubmit(e) {
        e.preventDefault();
        console.log("submit");

        let input = this.state.input;
        var words = input.split(' ');
        let query='';
        let test = true;


        words.forEach( word => {
        	if(test){
        		query=word;
        		test = false;
        	}else{
        		query+='+'+word;
        	}
        	
        });


        let URL = "https://api.github.com/search/commits?q="+query;

        let config = {
  			headers: {
    			"Content-Type" :"application/json",
    			"Accept" : "application/vnd.github.cloak-preview.v3+json",
  			}
		}

		axios.get(URL, config).then(response => {

			var messages = [];
			// messages.length = response.data.items.length;
			response.data.items.map(function(item,i){
				messages.push(item.commit.message);

			});


			this.setState({
					results: response.data.items,
					dataLoaded:true,
					messages:messages,
					detailLoaded:false,


			});


		}
			
		).catch(error => console.log(error, "SSSSS_ERROR axios request"));


    }

 onChangeWord(e){

  	this.setState({
            input: e.target.value
        });
  }

  handleDetail(i){
  	console.log(i,"SSSSSS_I");

  	var detail_i = this.state.results[i];
  	console.log(detail_i, "SSSSS_DETAIL");

  	this.setState({ 
  		detail:detail_i,
  		detailLoaded:true,
  		
  	});
  	

  }


	render() {
		return (
			<div>
				<h3>Enter the key word(s) to look up the different commit into the Github database :</h3>
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
                        <input type="submit" value="Search" className="btn btn-primary" />
                     </div>
                </form>
                <div className="box_component">
	                <ResultTable dataLoaded={this.state.dataLoaded} messages={this.state.messages} results={this.state.results} 
	                handleDetail={this.handleDetail}/>
	                <ResultDetail detailLoaded={this.state.detailLoaded} detail={this.state.detail}/>
                </div>

                

         	</div>



		);
	}

}