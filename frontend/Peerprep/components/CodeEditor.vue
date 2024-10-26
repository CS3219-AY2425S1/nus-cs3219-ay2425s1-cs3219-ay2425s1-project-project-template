<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { createClient } from "@liveblocks/client";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { useCollaborationStore } from '~/stores/collaborationStore'; // Store for real-time sync
import { useFirebaseApp, useFirestore } from 'vuefire';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const parent = ref(null);
const leave = ref(null);
const view = ref(null);

const firebaseApp = useFirebaseApp();
const db = useFirestore(firebaseApp);
const collaborationStore = useCollaborationStore();
const session_info = collaborationStore.getCollaborationInfo;

// Set up Liveblocks client
const client = createClient({
  publicApiKey: "pk_prod_jyhlDWr3kQrHYfKbpGbZeIh4Fb_YB1rCfBYzi4Yi-AAkUMPOXWBhsMWV5XHPe6wD",
});

// Enter a multiplayer room
const info = client.enterRoom(session_info.uid);
const room = info.room;
leave.value = info.leave;

// Set up Yjs document, shared text, and Liveblocks Yjs provider
const yDoc = new Y.Doc();
const yText = yDoc.getText("codemirror");
const yProvider = new LiveblocksYjsProvider(room, yDoc);

onMounted(async () => {
    // Create the Firestore document reference
    const docRef = doc(db, 'collaborations', session_info.uid);

    // Check if the document exists, otherwise create it with initial content
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        await setDoc(docRef, { code: '' });
    }

    // Set up CodeMirror and extensions
    const state = EditorState.create({
        doc: yText.toString(),
        extensions: [
        basicSetup,
        javascript(),
        yCollab(yText, yProvider.awareness),
        ],
    });

    // Attach CodeMirror to element
    view.current = new EditorView({
        state,
        parent: parent.value,
    });
    
    // Save to Firestore when the document changes
    yText.observe(() => {
        const currentCode = yText.toString();
        setDoc(docRef, { code: currentCode }, { merge: true })
        .then(() => console.log("Code saved to Firestore successfully"))
        .catch(error => console.error("Error saving to Firestore:", error));
    });

});

onUnmounted(() => {
    // Clean up Listeners
});
</script>

<template>
    <div ref="parent"></div>
</template>