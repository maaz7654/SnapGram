import { ID, Query } from "appwrite";
import { INewUser } from "@/types";
import { account, appwriteconfig, avatars, databases } from "./config";


export async function createNewUser(user:INewUser) {

    try {

        const newAccount=await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
            
        )

        if(!newAccount) throw Error;

        const avatarUrl= avatars.getInitials(user.name);

         const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
         })

         return newUser;


        
    } catch (error) {
        console.log(error);
        return error;
    }
    
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: string;
    username?:string; 
}) {

        try {
            const newUser = await databases.createDocument(
                appwriteconfig.databaseId, 
                appwriteconfig.userCollectionId,
                ID.unique(),
                user,
            )
            return newUser;
            
        } catch (error) {
            console.log(error);
        }


}

export async function signInAccount(user: {
    email: string;
    password: string;
}) {

    try {

        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
        
    } catch (error) {
        console.log(error);
    }

}

export async function getCurrentUser() {
    try {
        
        const currentAccount = await account.get();
        
        if(!currentAccount) throw Error;

        const currentuser = await databases.listDocuments(
            appwriteconfig.databaseId,
            appwriteconfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

        if(!currentuser) throw Error;

        return currentuser.documents[0];
    
    } catch (error) {
        console.log(error);
    }
}

