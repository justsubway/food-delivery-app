import {Account, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite";
import {CreateUserParams, GetMenuParams, SignInParams} from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.chomp.chompfood",
    databaseId: '68baf85e0012716bd857',
    bucketId: '68bc35fe001339a33b22',
    userCollectionId: 'user',
    categoriesCollectionId: 'categories',
    menuCollectionId: 'menu',
    customizationsCollectionId: 'customizations',
    menuCustomizationsCollectionId: 'menu_customizations'
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

// 🔹 create user
export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if (!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar: avatarUrl }
        );
    } catch (e) {
        throw new Error(e as string);
    }
}

// 🔹 sign in (clear any old sessions first)
export const signIn = async ({ email, password }: SignInParams) => {
    try {
        try { await account.deleteSession("current"); } catch {}
        return await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
}

// 🔹 sign out
export const signOut = async () => {
    try {
        await account.deleteSession("current");
    } catch (e) {
        throw new Error(e as string);
    }
}

// 🔹 get current user (safe)
export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) return null;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        return currentUser.documents[0] ?? null;
    } catch {
        return null;
    }
}

// 🔹 get menu
export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        // First try to get from Appwrite database
        const queries: string[] = [];

        if (category) queries.push(Query.equal('categories', category));
        if (query) queries.push(Query.search('name', query));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries,
        );

        // If we have data from database, return it
        if (menus.documents.length > 0) {
            return menus.documents;
        }

        // Fallback to local data if database is empty
        const { default: dummyData } = await import('./data');
        let filteredMenu = dummyData.menu;

        // Apply category filter
        if (category && category !== 'All') {
            filteredMenu = filteredMenu.filter(item => 
                item.category_name.toLowerCase() === category.toLowerCase()
            );
        }

        // Apply search filter
        if (query) {
            filteredMenu = filteredMenu.filter(item => 
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Convert to Appwrite document format
        return filteredMenu.map((item, index) => ({
            $id: `local-${index}`,
            $createdAt: new Date().toISOString(),
            $updatedAt: new Date().toISOString(),
            $permissions: [],
            $collectionId: 'menu',
            $databaseId: 'local',
            ...item
        }));

    } catch (e) {
        // If Appwrite fails, use local data as fallback
        console.log('Appwrite failed, using local data:', e);
        const { default: dummyData } = await import('./data');
        let filteredMenu = dummyData.menu;

        if (category && category !== 'All') {
            filteredMenu = filteredMenu.filter(item => 
                item.category_name.toLowerCase() === category.toLowerCase()
            );
        }

        if (query) {
            filteredMenu = filteredMenu.filter(item => 
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            );
        }

        return filteredMenu.map((item, index) => ({
            $id: `local-${index}`,
            $createdAt: new Date().toISOString(),
            $updatedAt: new Date().toISOString(),
            $permissions: [],
            $collectionId: 'menu',
            $databaseId: 'local',
            ...item
        }));
    }
}

// 🔹 get categories
export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
        );

        // If we have data from database, return it
        if (categories.documents.length > 0) {
            return categories.documents;
        }

        // Fallback to local data if database is empty
        const { default: dummyData } = await import('./data');
        return dummyData.categories.map((category, index) => ({
            $id: `local-cat-${index}`,
            $createdAt: new Date().toISOString(),
            $updatedAt: new Date().toISOString(),
            $permissions: [],
            $collectionId: 'categories',
            $databaseId: 'local',
            ...category
        }));

    } catch (e) {
        // If Appwrite fails, use local data as fallback
        console.log('Appwrite categories failed, using local data:', e);
        const { default: dummyData } = await import('./data');
        return dummyData.categories.map((category, index) => ({
            $id: `local-cat-${index}`,
            $createdAt: new Date().toISOString(),
            $updatedAt: new Date().toISOString(),
            $permissions: [],
            $collectionId: 'categories',
            $databaseId: 'local',
            ...category
        }));
    }
}
