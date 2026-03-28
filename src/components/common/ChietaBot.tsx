import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Image,
    Animated,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import { getBotReply, BotMessage, QUICK_CHIPS, SUGGESTIONS } from "@/core/helpers/bot";
import { _bot, chatBot, chatSquare } from "@/components/loadAssets";
import colors from "@/config/colors";
import { cs } from "@/styles/LandingStyles";

// ================= CHATBOT DATA =================
interface ChatAttachment {
    name: string;
    uri: string;
    mimeType?: string;
    isImage: boolean;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'bot';
    text: string;
    attachments?: ChatAttachment[];
    timestamp: Date;
}

// const SUGGESTIONS = [
//   { icon: 'help-circle', label: 'What is CHIETA?' },
//   { icon: 'file-text', label: 'How do I apply for a grant?' },
//   { icon: 'award', label: 'Skills training programmes' },
//   { icon: 'briefcase', label: 'Career opportunities' },
//   { icon: 'phone', label: 'Contact & support' },
// ] as const;

// const QUICK_CHIPS = [
//   'Tell me more',
//   'Eligibility requirements',
//   'Application deadlines',
//   'Required documents',
//   'Track my application',
// ];

// function getBotReply(input: string, hasAttachments: boolean): string {
//   const q = input.toLowerCase();
//   if (hasAttachments)
//     return "Thank you for sharing that file. Our team will review it and get back to you. For urgent queries please contact info@chieta.org.za.";
//   if (q.includes('chieta'))
//     return "CHIETA (Chemical Industries Education & Training Authority) is a SETA responsible for skills development in the chemical industries sector in South Africa. We facilitate training, grant funding, and learnerships to upskill workers across the sector.";
//   if (q.includes('grant') || q.includes('apply') || q.includes('application'))
//     return "To apply for a grant, log into the IMS Portal from this app. You need to be registered as an employer or training provider. Mandatory grants cover 20% of your Skills Development Levy (SDL), while discretionary grants are competitive and project-based.\n\nTap 'Login to IMS Portal' on the home screen to get started.";
//   if (q.includes('skill') || q.includes('training') || q.includes('learner'))
//     return "CHIETA funds a wide range of skills programmes including learnerships, apprenticeships, skills programmes, and bursaries. These are accessible to employed and unemployed individuals in the chemical sector. Visit our SSC portal for more details.";
//   if (q.includes('career') || q.includes('job') || q.includes('vacanc'))
//     return "CHIETA regularly posts career opportunities on our website. Browse vacancies via the Careers card on the home screen, which links directly to live listings at chieta.org.za/careers/vacancies.";
//   if (q.includes('contact') || q.includes('support') || q.includes('phone'))
//     return "You can reach us at:\n\u{1F4E7} info@chieta.org.za\n\u{1F4DE} 011 628 7000\n\u{1F550} Mon\u2013Fri, 08:00\u201316:30\n\nFor application queries, use the IMS Portal in-app support form for the fastest response.";
//   if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('good morning') || q.includes('good day'))
//     return "Hello! \uD83D\uDC4B I am the CHIETA Assistant. I can help you with information about grants, skills programmes, career opportunities, and more. How can I assist you today?";
//   if (q.includes('deadline') || q.includes('when'))
//     return "Annual Mandatory Grant applications close on 30 April each year. Discretionary Grant windows vary by project \u2014 check the IMS Portal Notifications section or follow @CHIETA_ZA on social media for announcements.";
//   if (q.includes('document') || q.includes('require'))
//     return "Grant applications typically require: a valid B-BBEE certificate, updated WSP/ATR, tax clearance pin, company registration documents, and signed SDL proof. Specific requirements are listed per grant type in the IMS Portal.";
//   if (q.includes('track') || q.includes('status') || q.includes('progress'))
//     return "Track your application status in the IMS Portal under 'My Applications'. Status updates are sent via email and also appear as notifications in this app.";
//   if (q.includes('tell me more') || q.includes('more info'))
//     return "I can tell you more about any of these topics: grants, skills programmes, career opportunities, contact details, or application requirements. Which would you like to explore?";
//   return "Thank you for your question. For queries I cannot yet answer here, please contact info@chieta.org.za or call 011 628 7000, Mon\u2013Fri 08:00\u201316:30. You can also access detailed self-service support through the IMS Portal.";
// }

// ================= TYPING INDICATOR =================
function TypingIndicator() {
    const dot0 = useRef(new Animated.Value(0.35)).current;
    const dot1 = useRef(new Animated.Value(0.35)).current;
    const dot2 = useRef(new Animated.Value(0.35)).current;
    const dots = [dot0, dot1, dot2];

    useEffect(() => {
        const anims = dots.map((d, i) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(i * 180),
                    Animated.timing(d, { toValue: 1, duration: 340, useNativeDriver: true }),
                    Animated.timing(d, { toValue: 0.35, duration: 340, useNativeDriver: true }),
                ])
            )
        );
        anims.forEach(a => a.start());
        return () => anims.forEach(a => a.stop());
    }, []);

    return (
        <View style={cs.bubbleRow}>
            <View style={cs.botAvatar}>
                <Image source={_bot} style={{ width: 20, height: 20, borderRadius: 10 }} />
            </View>
            <View style={[cs.bubble, cs.bubbleBot, { paddingVertical: 12, paddingHorizontal: 16 }]}>
                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                    {dots.map((d, i) => (
                        <Animated.View key={i} style={[cs.typingDot, { opacity: d }]} />
                    ))}
                </View>
            </View>
        </View>
    );
}

// ================= BOT TEXT RENDERER =================
// Parses [icon:name] tokens embedded in bot reply strings and renders
// them as Ionicons inline with the surrounding text.
const ICON_TOKEN_RE = /\[icon:([^\]]+)\]/g;
type BotSegment = { type: 'text'; value: string } | { type: 'icon'; name: string };

function parseBotLine(line: string): BotSegment[] {
    const segs: BotSegment[] = [];
    let last = 0;
    ICON_TOKEN_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = ICON_TOKEN_RE.exec(line)) !== null) {
        if (m.index > last) segs.push({ type: 'text', value: line.slice(last, m.index) });
        segs.push({ type: 'icon', name: m[1] });
        last = m.index + m[0].length;
    }
    if (last < line.length) segs.push({ type: 'text', value: line.slice(last) });
    return segs;
}

function BotText({ text, textStyle, iconColor }: { text: string; textStyle: any; iconColor: string }) {
    const lines = text.split('\n');
    return (
        <View>
            {lines.map((line, i) => {
                // Empty lines → compact spacer, not a full line-height gap
                if (!line.trim()) {
                    return <View key={i} style={{ height: 4 }} />;
                }
                const segs = parseBotLine(line);
                const hasIcon = segs.some(s => s.type === 'icon');
                if (!hasIcon) {
                    return <Text key={i} style={textStyle}>{line}</Text>;
                }
                // Lines with icons: prefix text (e.g. bullet '• ') stays compact;
                // text that follows an icon gets flex:1 so it wraps correctly.
                let seenIcon = false;
                return (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: i === 0 ? 0 : 2 }}>
                        {segs.map((seg, j) => {
                            if (seg.type === 'icon') {
                                seenIcon = true;
                                return (
                                    <Icon
                                        key={j}
                                        name={seg.name as any}
                                        size={14}
                                        color={iconColor}
                                        style={{ marginTop: 3, marginRight: 4 }}
                                    />
                                );
                            }
                            // Text before the first icon (e.g. '• '): no flex, stays compact
                            // Text after an icon: flex:1 so it wraps to fill remaining width
                            return (
                                <Text key={j} style={seenIcon ? [textStyle, { flex: 1 }] : textStyle}>
                                    {seg.value}
                                </Text>
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );
}

// ================= MESSAGE BUBBLE =================
function MessageBubble({ msg }: { msg: ChatMessage }) {
    const isUser = msg.role === 'user';
    const timeStr = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <View style={[cs.bubbleRow, isUser && cs.bubbleRowUser]}>
            {!isUser && (
                <View style={cs.botAvatar}>
                    <Image source={_bot} style={{ width: 25, height: 25, borderRadius: 10 }} />
                </View>
            )}
            <View style={{ maxWidth: '78%', gap: 4 }}>
                {msg.attachments && msg.attachments.length > 0 && (
                    <View style={{ gap: 4 }}>
                        {msg.attachments.map((a, i) => (
                            <View key={i} style={[cs.attachChip, isUser && cs.attachChipUser]}>
                                <Feather
                                    name={a.isImage ? 'image' : 'file'}
                                    size={12}
                                    color={isUser ? colors.primary[200] : colors.primary[600]}
                                />
                                <Text
                                    numberOfLines={1}
                                    style={[cs.attachChipText, isUser && { color: colors.primary[100] }]}
                                >
                                    {a.name}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
                {msg.text.length > 0 && (
                    <View style={[cs.bubble, isUser ? cs.bubbleUser : cs.bubbleBot]}>
                        {isUser ? (
                            <Text style={[cs.bubbleTxt, { color: colors.white }]}>{msg.text}</Text>
                        ) : (
                            <BotText
                                text={msg.text}
                                textStyle={cs.bubbleTxt}
                                iconColor={colors.slate[600]}
                            />
                        )}
                    </View>
                )}
                <Text style={[cs.ts, isUser && { textAlign: 'right' }]}>{timeStr}</Text>
            </View>
        </View>
    );
}


// ================= CHATBOT =================
export function ChatBot({ close }: { close: () => void }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [pending, setPending] = useState<ChatAttachment[]>([]);
    const listRef = useRef<FlatList<ChatMessage>>(null);

    const isEmpty = messages.length === 0;
    const showQuickChips = messages.length > 0 && !isTyping;

    function pushBotReply(userText: string, attachments: ChatAttachment[] = []) {
        setIsTyping(true);
        const delay = 800 + Math.random() * 700;
        // Capture last 6 messages as history for multi-turn context
        const historySnap: BotMessage[] = messages.slice(-6).map(m => ({ role: m.role, text: m.text }));
        setTimeout(() => {
            const reply: ChatMessage = {
                id: `bot-${Date.now()}`,
                role: 'bot',
                text: getBotReply(userText, attachments.length > 0, historySnap),
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, reply]);
            setIsTyping(false);
            setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
        }, delay);
    }

    function handleSend() {
        const text = inputText.trim();
        if (!text && pending.length === 0) return;
        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            text,
            attachments: pending.length > 0 ? [...pending] : undefined,
            timestamp: new Date(),
        };
        const snap = [...pending];
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setPending([]);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 60);
        pushBotReply(text, snap);
    }

    function sendSuggestion(label: string) {
        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            text: label,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 60);
        pushBotReply(label);
    }

    async function attach(imagesOnly: boolean) {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: imagesOnly ? 'image/*' : '*/*',
                multiple: true,
                copyToCacheDirectory: false,
            });
            if (result.canceled) return;
            const newAttachments: ChatAttachment[] = result.assets.map(a => ({
                name: a.name,
                uri: a.uri,
                mimeType: a.mimeType ?? undefined,
                isImage: imagesOnly || (a.mimeType?.startsWith('image/') ?? false),
            }));
            setPending(prev => [...prev, ...newAttachments]);
        } catch (_) { }
    }

    const canSend = inputText.trim().length > 0 || pending.length > 0;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
            {/* Header */}
            <View style={cs.header}>
                <View style={cs.headerLeft}>
                    <View style={cs.avatarWrap}>
                        <Image source={_bot} style={cs.avatarImg} />
                        <View style={cs.onlineDot} />
                    </View>
                    <View style={{ gap: 1 }}>
                        <Text style={cs.headerTitle}>CHIETA Assistant</Text>
                        <Text style={[cs.headerSub, isTyping && { color: colors.primary[500] }]}>
                            {isTyping ? 'Typing\u2026' : '\u25CF Online'}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={close} style={cs.closeBtn} hitSlop={8}>
                    <Icon name="close" size={22} color={colors.slate[600]} />
                </TouchableOpacity>
            </View>

            {/* Empty state or message list */}
            {isEmpty ? (
                <ScrollView
                    contentContainerStyle={cs.emptyState}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={cs.emptyIconWrap}>
                        <Image source={_bot} style={{ width: 60, height: 60, borderRadius: 30 }} />
                    </View>
                    <Text style={cs.emptyTitle}>How can I help you today?</Text>
                    <Text style={cs.emptySub}>
                        Ask me anything about CHIETA grants, skills programmes, career opportunities, or get support.
                    </Text>
                    <View style={cs.sugGrid}>
                        {SUGGESTIONS.map(s => (
                            <TouchableOpacity
                                key={s.label}
                                style={cs.sugCard}
                                onPress={() => sendSuggestion(s.label)}
                                activeOpacity={0.75}
                            >
                                <View style={cs.sugIconCircle}>
                                    <Feather name={s.icon as any} size={16} color={colors.primary[600]} />
                                </View>
                                <Text style={cs.sugText}>{s.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <FlatList
                    ref={listRef}
                    style={{ flexGrow: 1 }}
                    data={messages}
                    keyExtractor={m => m.id}
                    renderItem={({ item }) => <MessageBubble msg={item} />}
                    contentContainerStyle={cs.msgList}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    ListFooterComponent={isTyping ? <TypingIndicator /> : null}
                    onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
                />
            )}

            {/* Quick-reply chips */}
            {showQuickChips && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={cs.chipsBar}
                    contentContainerStyle={{ paddingHorizontal: 14, gap: 8, paddingVertical: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {QUICK_CHIPS.map(c => (
                        <TouchableOpacity key={c} style={cs.chip} onPress={() => sendSuggestion(c)} activeOpacity={0.75}>
                            <Text style={cs.chipText}>{c}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Pending attachments */}
            {pending.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={cs.pendingBar}
                    contentContainerStyle={{ paddingHorizontal: 12, gap: 8, alignItems: 'center', paddingVertical: 6 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {pending.map((a, i) => (
                        <View key={i} style={cs.pendingChip}>
                            <Feather name={a.isImage ? 'image' : 'file'} size={12} color={colors.primary[600]} />
                            <Text numberOfLines={1} style={cs.pendingChipText}>{a.name}</Text>
                            <TouchableOpacity onPress={() => setPending(p => p.filter((_, j) => j !== i))} hitSlop={4}>
                                <Icon name="close-circle" size={14} color={colors.slate[400]} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Input bar */}
            <View style={cs.inputBar}>
                <TouchableOpacity style={cs.inputAction} onPress={() => attach(true)} hitSlop={4}>
                    <Feather name="image" size={19} color={colors.primary[500]} />
                </TouchableOpacity>
                <TouchableOpacity style={cs.inputAction} onPress={() => attach(false)} hitSlop={4}>
                    <Feather name="paperclip" size={19} color={colors.primary[500]} />
                </TouchableOpacity>
                <TextInput
                    style={cs.textInput}
                    placeholder={"Message CHIETA Assistant\u2026"}
                    placeholderTextColor={colors.slate[400]}
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    maxLength={800}
                    returnKeyType="default"
                    blurOnSubmit={false}
                />
                <TouchableOpacity
                    style={[cs.sendBtn, canSend && cs.sendBtnActive]}
                    onPress={handleSend}
                    disabled={!canSend}
                    activeOpacity={0.8}
                >
                    <Icon name="send" size={18} color={canSend ? colors.white : colors.slate[400]} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}