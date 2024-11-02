package com.example.backend.websocketchat.config;

import java.io.Serializable;
import java.security.Principal;

import lombok.Data;

@Data
public class ChatUserPrincipal implements Principal, Serializable {
    private final String userWSID; // Identify each user through userID + wsID

    public ChatUserPrincipal(String userWSID) {
        if (userWSID == null) {
            throw new NullPointerException("null name is illegal");
        }
        this.userWSID = userWSID;
    }

    @Override
    public String getName() {
        return this.userWSID;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof ChatUserPrincipal) {
            ChatUserPrincipal other = (ChatUserPrincipal) obj;
            return this.userWSID.equals(other.getName());
        }
        return false;
    }

    @Override
    public int hashCode() {
        return this.userWSID.hashCode();
    }

    @Override
    public String toString() {
        return "ChatUserPrincipal{name='" + this.userWSID + "'}";
    }
}
