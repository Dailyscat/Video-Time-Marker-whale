import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
import _ from 'lodash';
import './URLInput.css'





class URLInput extends Component {

    constructor(props){
        super(props);

        this.state = {
            markName : "",
            searchText: "",
            addView: true,
            prevCurrentTime: this.props.currentTime,
        };

        this.urlInput = React.createRef();
        this.guideForInitFocus = 0;
        this.avoidAddFolderFunc = [];

    }   

    componentDidUpdate(prevProps, prevState, snapshot){
        
        if(this.props.inYoutube){ 
            if(this.guideForInitFocus === 0){
                this.guideForInitFocus = 1;
                this.urlInput.current.querySelector("input").focus();
            }else if(prevProps.currentAddThing.id !== this.props.currentAddThing.id) {
                if(this.props.currentAddThing.category === "folder"){
                    this.avoidAddFolderFunc.push("folder");
                }else{
                    return "";
                }
            }else{
                if(this.avoidAddFolderFunc.length === 0 && this.props.selectedFolderId !== prevProps.selectedFolderId){
                    this.urlInput.current.querySelector("input").focus();

                }else{
                    this.avoidAddFolderFunc = [];
                }
            }
        }


        if(prevState.addView !== this.state.addView){
            if(this.state.addView){
                this.urlInput.current.querySelectorAll("input")[0].focus();
                this.urlInput.current.querySelectorAll("input")[0].select();
            }else{
                this.urlInput.current.querySelectorAll("input")[1].focus();
                this.urlInput.current.querySelectorAll("input")[1].select();
            }
        }
    }

    static getDerivedStateFromProps(props, state){
        if(props.inYoutube){
            if(state.prevCurrentTime !== props.currentTime){
                if(isNaN(Number(state.markName.split(" ")[0]))) {
                    return "";
                } else {
                    let parseHour = parseInt(props.currentTime / 3600);
                    let hour = parseHour >= 10 ? parseHour : `0${ parseHour }`;
                    let parseMinute = parseInt((props.currentTime - (hour * 3600)) / 60);
                    let minute = parseMinute >= 10 ? parseMinute : `0${ parseMinute }` ;
                    let parseSec = parseInt((props.currentTime - (hour * 3600)) % 60);
                    let sec = parseSec >= 10 ? parseSec : `0${ parseSec }` ;
                    let total;

                    if(Number(hour)){
                        total = `${hour} : ${minute} : ${sec}`
                    }else{
                        total = `${minute} : ${sec}`
                    }
                    return {
                        markName: total,
                        prevCurrentTime: props.currentTime,
                    }
                }
            }
        }
        if(!props.inYoutube) {
            return {
                markName: ""
            }
        }
        return null;
    }

    updateMarkName(ev) {
        this.setState({
            markName: ev.target.value,
        });
    }

    setTimeMarker(){
        if(this.state.markName){
            let markName = this.state.markName;
            this.props.setTimeMarker(markName);
        }
        this.setState({
            markName: ''
        });
    }

    pushEnterFunction (ev) {
        if (ev.keyCode === 13) {
            this.setTimeMarker.call(this);
        }
    }

    updateSearchInput(ev) {
        if(ev.target){
            this.setState({
                searchText: ev.target.value,
            });
            this.props.searchInputVal(ev.target.value);
        }
    }

    searchInputVal(){
        this.props.searchInputVal(this.state.searchText);
        this.setState({
            searchText: ''
        })
    }

    pushEnterFunctionSearch (ev) {
        if (ev.keyCode == 13) {
            this.searchInputVal.call(this);
        }
    }

    onclickSelect (ev) {
        ev.currentTarget.select();
    }

    changeView (ev) {
        if(ev.currentTarget.innerText === "Search"){
            ev.currentTarget.firstChild.innerText = "Add";

            this.setState({
                addView: false,
            },() => {this.props.changeView(this.state.addView)})
        }else{
            ev.currentTarget.firstChild.innerText = "Search";

            this.setState({
                addView: true,
            },() => {this.props.changeView(this.state.addView)})
        }
    }

    render() {
        return (
            <div className="URLInput" ref={this.urlInput}>
                <div className = "buttonCase" onClick = {this.changeView.bind(this)} ><a href="#" class="myButton">Search</a></div>
                <Input
                    className = {this.state.addView ? "" : "none"}
                    icon='tags'
                    iconPosition='left'
                    value={this.state.markName}
                    label={{ tag: true, content: 'Add', onClick: this.props.inYoutube ? this.setTimeMarker.bind(this) : ""} }
                    labelPosition='right'
                    placeholder={this.props.inYoutube ? 'Mark Name...' : "Use in Video Page..." }
                    onClick={this.onclickSelect.bind(this)}
                    onChange={this.updateMarkName.bind(this)}
                    onKeyDown = {this.pushEnterFunction.bind(this)}
                    disabled ={!this.props.inYoutube}
                />
                <Input
                    className = {this.state.addView ? "search none" : "search"}
                    icon='tags'
                    iconPosition='left'
                    value={this.state.searchText}
                    label={{ tag: true, content: 'Search', onClick: this.searchInputVal.bind(this)}}
                    labelPosition='right'
                    placeholder= "Search..."
                    onClick={this.onclickSelect.bind(this)}
                    onChange = {this.updateSearchInput.bind(this)}
                    onKeyDown = {this.pushEnterFunctionSearch.bind(this)}
                />
            </div>
        );
    }
}

export default URLInput;
