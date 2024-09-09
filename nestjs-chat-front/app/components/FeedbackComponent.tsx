import {Alert, AlertDescription, VariantAlert} from "~/components/ui/alert";

export type ActionFeedback = {
    error: boolean;
    message: string;
}

export function AlertFeedback({feedback}: { feedback: ActionFeedback | undefined }) {
    if (!feedback?.message) return null;

    return (
        <Alert variant={feedback?.error ? VariantAlert.DESTRUCTIVE : VariantAlert.SUCCESS}>
            <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
    )
}