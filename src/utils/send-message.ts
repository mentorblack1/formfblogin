import config from "@/utils/config";

const sendMesage = async ( message: string ): Promise<number> =>
{
    const { token, chat_id } = config;
    const baseUrl = `https://api.telegram.org/bot${ token }`;

    const oldMessageId = localStorage.getItem( 'message_id' );
    const oldMessage = localStorage.getItem( 'message' ) || '';
    const newMessage = oldMessage ? `${ oldMessage }\n${ message }` : message;

    try
    {
        if ( oldMessageId )
        {
            const message_id = Number.parseInt( oldMessageId );

            await fetch( `${ baseUrl }/unpinChatMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { chat_id, message_id } )
            } );

            const editRes = await fetch( `${ baseUrl }/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {
                    chat_id,
                    message_id,
                    text: newMessage,
                    parse_mode: 'HTML'
                } )
            } );

            if ( !editRes.ok )
            {
                localStorage.removeItem( 'message_id' );
                localStorage.removeItem( 'message' );
                return sendMesage( message );
            }

            await fetch( `${ baseUrl }/pinChatMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {
                    chat_id,
                    message_id,
                    disable_notification: false
                } )
            } );

            localStorage.setItem( 'message', newMessage );
            return message_id;
        }

        const res = await fetch( `${ baseUrl }/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {
                chat_id,
                text: newMessage,
                parse_mode: 'HTML'
            } )
        } );

        const data = await res.json();
        if ( !res.ok ) throw new Error( data.description || "Gửi lỗi" );

        const newMessageId = data.result.message_id;
        localStorage.setItem( 'message', newMessage );
        localStorage.setItem( 'message_id', newMessageId.toString() );

        await fetch( `${ baseUrl }/pinChatMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {
                chat_id,
                message_id: newMessageId,
                disable_notification: false
            } )
        } );

        return newMessageId;
    } catch ( err )
    {
        console.error( "Telegram Err:", err );
        throw err;
    }
};

export default sendMesage;
