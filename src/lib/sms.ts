import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendPhoneVerificationCode(
    phoneNumber: string
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!twilioClient || !verifyServiceSid) {
            console.warn('Twilio Verify not configured. Simulating SMS send.');
            console.log(`Verify SMS to ${phoneNumber}: Code sent via Twilio Verify`);
            return { success: true };
        }

        // Format phone number if needed (add +1 for US if not present)
        let formattedPhone = phoneNumber;
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+' + formattedPhone;
        }

        await twilioClient.verify.v2
            .services(verifyServiceSid)
            .verifications.create({
                to: formattedPhone,
                channel: 'sms',
            });

        return { success: true };
    } catch (error) {
        console.error('Failed to send verification code:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send verification code',
        };
    }
}

export async function verifyPhoneCode(
    phoneNumber: string,
    code: string
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!twilioClient || !verifyServiceSid) {
            console.warn('Twilio Verify not configured. Simulating verification.');
            // In demo mode, accept any 6-digit code
            return code.length === 6 ? { success: true } : { success: false, error: 'Invalid code' };
        }

        // Format phone number if needed
        let formattedPhone = phoneNumber;
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+' + formattedPhone;
        }

        const verification = await twilioClient.verify.v2
            .services(verifyServiceSid)
            .verificationChecks.create({
                to: formattedPhone,
                code: code,
            });

        if (verification.status === 'approved') {
            return { success: true };
        }

        return { success: false, error: 'Invalid verification code' };
    } catch (error) {
        console.error('Failed to verify code:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Verification failed',
        };
    }
}
