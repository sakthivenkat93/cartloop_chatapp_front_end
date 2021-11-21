import { render } from '@testing-library/react';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import Socket from './Socket';
import { setCurrentMessage, setMessages } from './messageSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faEllipsisH, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

var socket: any;

var macros = [{id: "1", content: "Alpha is the first macro."},{id: "2", content: "Bravo is the second macro."},{id: "3", content: "Charlie is the third macro."},{id: "4", content: "Delta is the fourth macro."}];

function App() {
	const [status, setStatus] = useState("");
	const currentMessage = useSelector((state: any) => state.messages.currentMessage);
	const [user, setUser] = useState("");

	const dispatch = useDispatch();

	function createConnection() {
		socket = new Socket(onConnectionChange, onIncomingMessage);
		socket.connect("alpha", "8081");
	}

	const onConnectionChange = (isConnected: boolean) => {
		console.log('connection changed');
		setStatus("connected");
	};

	const onIncomingMessage = (message: { from: string, content: string }) => {
		dispatch(setMessages(message));
	}

	function sendMessage(user: any, currentMessage: any) {
		currentMessage = currentMessage.match(/^[-=., A-Za-z0-9]+$/);
		let sendmessage = { "from": user, "content": currentMessage, "time": new Date(Date.now()).toLocaleDateString() };
		if (!socket) {
			socket = new Socket(onConnectionChange, onIncomingMessage);
			socket.connect(user, "8081");
		}
		socket.sendMessage(sendmessage);
	}

	function setMessage(message: any) {
		dispatch(setCurrentMessage(message));
	}

	function sendOutsideMessage() {
		sendMessage(user, currentMessage);
		document.getElementsByClassName("messageinput")[0].textContent = "";
	}

	return (
		<div className="App">
			<div className="appheader">
				<input className="userinput" type="text" placeholder="user" onChange={e => setUser(e.target.value)} />
				<button className="inputbutton" disabled={user == "" || status == "connected"} onClick={createConnection}>connect</button>
			</div>
			<div className="messageappsection">
				<MessageList user={user}></MessageList>
				<MessageInput sendMessage={sendOutsideMessage} setMessage={setMessage} status={status} />
			</div>
			<MacroPool></MacroPool>
		</div>
	);
}

const MessageList = (props: any) => {
	const messages = useSelector((state: any) => state.messages.value);
	const sender = "sender";
	const receiver = "receiver";

	return (
		<div className="appsection messagelist">
			<div className="messagesectionheader">
				<div className="messagesectionheadertitle">
					In progress
				</div>
				<div className="messagesectionheadermenucontainer">
				<FontAwesomeIcon icon={faEllipsisH}/>
				</div>
			</div>
			<div className="messagesectioncontainer">
			{messages.filter(function(message: any){if(message.content == undefined) {return false}return true}).map((message: any, index: number) => <div key={index}>
				<div className="messagecontainer">
						<div className={`username ${message.from == props.user ? sender : receiver}`}>{message.from}</div>
						<div className={`message ${message.from == props.user ? sender : receiver}`}>{message.content}</div>
				</div>
			</div>)}
			</div>
		</div>
	);
}

const MessageInput = (props: any) => {

	function setMessage(e:any) {
		props.setMessage(e.target.textContent);
	}
	return (
		<div className="appsection">
			<div className="messageinputsection">
				<div suppressContentEditableWarning={true} contentEditable="true" placeholder="enter message" className="messageinput" onInput={setMessage}> </div>
				<hr className="messageinputsectionseparator" /><br />
				<div className="addiconcontainer">
				<FontAwesomeIcon icon={faPlusCircle} size="2x" color="#e75818"/>
				</div>
				<button className="inputbutton" onClick={props.sendMessage} disabled={props.status == ""}>send message</button>
			</div>
		</div>
	);
}

const MacroPool = (props: any) => {

	function setSelectedState(e: any){
		let className = e.target.className;
		if(!className.includes("selectedMacro")){
			e.target.className += "selectedMacro";
			document.getElementsByClassName("messageinput")[0].textContent = e.target.textContent;
		}
		else{
			e.target.className = e.target.className.replace('selectedMacro','');
			document.getElementsByClassName("messageinput")[0].textContent = "";
		}
	}

	return(
		<div className="appsection macrosection">
			<div className="macroheader">
				<div className="macroheadertitle">
					Macros
				</div>
				<div className="macroheaderdropdownicon">
				<FontAwesomeIcon icon={faChevronDown}/>
				</div>
			</div>
			<div className="macrocontainerbody">
				{macros.map((macro:any, index:any) =>
				<div className="macro " key={index} onClick={setSelectedState} >{macro.content}</div> 
				)}
			</div>
		</div>
	);
}

export default App;
