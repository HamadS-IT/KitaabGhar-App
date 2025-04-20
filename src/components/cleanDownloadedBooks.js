/* eslint-disable no-unused-vars */
import RNFS from 'react-native-fs';

const cleanDownloadedBooks = async () => {
    try {
        const hiddenFolderPath = `${RNFS.DocumentDirectoryPath}/.ebooks`;

        // Ensure the folder exists
        const folderExists = await RNFS.exists(hiddenFolderPath);
        if (!folderExists) {
            console.log('⚠️ No hidden folder found.');
            return;
        }

        // Read files from the hidden directory
        const files = await RNFS.readDir(hiddenFolderPath);
        const today = new Date();

        for (const file of files) {
            if (!file.name.endsWith('.pdf')) {continue;} // Skip non-PDF files

            const bookFileName = file.name.replace('.pdf', '');
            const nameParts = bookFileName.split('____');

            // Delete files with invalid format (should have 4 parts)
            if (nameParts.length !== 5) {
                console.warn(`🗑 Deleting invalid file: ${file.name}`);
                await RNFS.unlink(file.path); // Delete the invalid file
                continue;
            }

            // Extract book details
            const [userId,bookId, bookName, authorName, expiryDateStr] = nameParts;

            // Convert expiry date format (replace "99999" with "-")
            const formattedExpiryDateStr = expiryDateStr.replace(/99999/g, '-');

            // Parse expiry date
            const expiryDate = new Date(formattedExpiryDateStr);

            // Delete expired books
            if (expiryDate < today) {
                console.log(`🗑 Deleting expired book: ${bookName} (Expired on: ${formattedExpiryDateStr})`);
                await RNFS.unlink(file.path); // Delete the PDF file

                // Also delete the cover image if it exists
                const coverFile = `${hiddenFolderPath}/${bookFileName}.jpg`;
                const coverExists = await RNFS.exists(coverFile);
                if (coverExists) {
                    await RNFS.unlink(coverFile);
                }
            }
        }

        console.log('✅ Clean-up completed.');
    } catch (error) {
        console.error('❌ Error cleaning downloaded books:', error.message);
    }
};



export default cleanDownloadedBooks;
