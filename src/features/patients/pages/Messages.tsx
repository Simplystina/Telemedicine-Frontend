import { useState } from "react";
import { FiSearch, FiSend, FiPaperclip, FiMoreVertical, FiVideo, FiPhone } from "react-icons/fi";

const MOCK_CONTACTS = [
    {
        id: "c1",
        name: "Dr. Sarah Jenkins",
        specialty: "Cardiologist",
        lastMessage: "Your test results look perfectly normal.",
        time: "10:42 AM",
        unread: 1,
        online: true,
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60"
    },
    {
        id: "c2",
        name: "Dr. Marcus Johnson",
        specialty: "General Physician",
        lastMessage: "Please remember to take your medication with food.",
        time: "Yesterday",
        unread: 0,
        online: false,
    },
    {
        id: "c3",
        name: "Dr. Emily Clark",
        specialty: "Pediatrician",
        lastMessage: "You can book an appointment for next week.",
        time: "Oct 20",
        unread: 0,
        online: true,
        imageUrl: "https://images.unsplash.com/photo-1594824436998-dd40e4f29d4b?w=150&auto=format&fit=crop&q=60"
    }
];

const MOCK_MESSAGES = [
    { id: "m1", senderId: "c1", text: "Hello! I reviewed your recent CBC lab results.", timestamp: "10:30 AM", isMine: false },
    { id: "m2", senderId: "me", text: "Hi Dr. Jenkins. Are they okay?", timestamp: "10:35 AM", isMine: true },
    { id: "m3", senderId: "c1", text: "Yes, your test results look perfectly normal. Your cholesterol levels have improved significantly since your last visit.", timestamp: "10:42 AM", isMine: false },
];

function Messages() {
    const [activeContactId, setActiveContactId] = useState("c1");
    const [messageInput, setMessageInput] = useState("");

    const activeContact = MOCK_CONTACTS.find(c => c.id === activeContactId);

    return (
        <div className="animate-fade-in-up h-[calc(100vh-140px)] min-h-[600px] flex flex-col">
            <div className="mb-4">
                <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Messages</h1>
                <p className="text-neutral-600 font-poppins text-sm">
                    Securely communicate with your healthcare providers.
                </p>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex h-full">

                {/* Left Sidebar: Contacts List */}
                <div className="w-full md:w-80 border-r border-neutral-200 flex flex-col bg-neutral-50/50">
                    <div className="p-4 border-b border-neutral-200">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-poppins text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {MOCK_CONTACTS.map(contact => (
                            <button
                                key={contact.id}
                                onClick={() => setActiveContactId(contact.id)}
                                className={`w-full text-left p-4 flex items-start space-x-3 transition-colors border-b border-neutral-100 ${activeContactId === contact.id ? "bg-primary-50 border-l-4 border-l-primary-500" : "hover:bg-white border-l-4 border-l-transparent"
                                    }`}
                            >
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 border border-primary-200 overflow-hidden flex items-center justify-center text-primary-600 font-bold font-archivo">
                                        {contact.imageUrl ? (
                                            <img src={contact.imageUrl} alt={contact.name} className="w-full h-full object-cover" />
                                        ) : (
                                            contact.name.charAt(4)
                                        )}
                                    </div>
                                    {contact.online && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className={`text-sm font-bold font-archivo truncate ${activeContactId === contact.id ? 'text-primary-900' : 'text-neutral-900'}`}>
                                            {contact.name}
                                        </h4>
                                        <span className="text-xs font-poppins text-neutral-400 shrink-0 ml-2">{contact.time}</span>
                                    </div>
                                    <p className={`text-xs font-poppins truncate ${contact.unread > 0 ? "text-neutral-900 font-semibold" : "text-neutral-500"}`}>
                                        {contact.lastMessage}
                                    </p>
                                </div>
                                {contact.unread > 0 && (
                                    <div className="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">
                                        {contact.unread}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Area: Chat Window */}
                <div className="hidden md:flex flex-1 flex-col bg-white overflow-hidden">
                    {/* Chat Header */}
                    {activeContact && (
                        <div className="h-16 px-6 border-b border-neutral-200 flex items-center justify-between shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 overflow-hidden flex items-center justify-center text-primary-600 font-bold font-archivo">
                                    {activeContact.imageUrl ? (
                                        <img src={activeContact.imageUrl} alt={activeContact.name} className="w-full h-full object-cover" />
                                    ) : (
                                        activeContact.name.charAt(4)
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold font-archivo text-neutral-900">{activeContact.name}</h3>
                                    <p className="text-xs font-poppins text-green-600">
                                        {activeContact.online ? "Online Now" : activeContact.specialty}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-neutral-100 rounded-lg transition-colors">
                                    <FiPhone className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-neutral-100 rounded-lg transition-colors">
                                    <FiVideo className="w-5 h-5" />
                                </button>
                                <div className="w-px h-6 bg-neutral-200 mx-1"></div>
                                <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                                    <FiMoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/30">
                        {MOCK_MESSAGES.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                                {!msg.isMine && activeContact && (
                                    <img
                                        src={activeContact.imageUrl || `https://ui-avatars.com/api/?name=${activeContact.name}&background=random`}
                                        alt=""
                                        className="w-8 h-8 rounded-full mr-2 self-end mb-1 object-cover"
                                    />
                                )}
                                <div className={`max-w-[70%] ${msg.isMine ? '' : 'order-1'}`}>
                                    <div className={`p-4 rounded-2xl ${msg.isMine
                                            ? 'bg-primary-500 text-white rounded-br-sm'
                                            : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-sm shadow-sm'
                                        }`}>
                                        <p className="font-poppins text-sm leading-relaxed">{msg.text}</p>
                                    </div>
                                    <p className={`text-[10px] font-poppins text-neutral-400 mt-1 ${msg.isMine ? 'text-right' : 'text-left ml-2'}`}>
                                        {msg.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-neutral-200 shrink-0">
                        <div className="flex items-end space-x-2">
                            <button className="p-3 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors shrink-0">
                                <FiPaperclip className="w-5 h-5" />
                            </button>
                            <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
                                <textarea
                                    className="w-full max-h-32 bg-transparent p-3 outline-none resize-none font-poppins text-sm"
                                    placeholder="Type your message securely..."
                                    rows={1}
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                ></textarea>
                            </div>
                            <button className="p-3 bg-primary-500 text-white hover:bg-primary-600 rounded-xl transition-colors shadow-sm shrink-0">
                                <FiSend className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Messages;
