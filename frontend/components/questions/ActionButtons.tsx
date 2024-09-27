import { Question } from "@/types/questions";
import type { PressEvent } from '@react-types/shared';

import { Button } from "@nextui-org/button";

interface ActionButtonsProps {
    question: Question;
}

interface ActionButtonProp {
    onClick: (event:PressEvent) => void;
    color: 'default' | 'primary' | 'warning' | 'danger';
    children: React.ReactNode
}
const ActionButton = ({ onClick, color, children }: ActionButtonProp) => {
    // add loading state if needed
    return (
        <Button onPress={onClick} color={color} variant='ghost' size='sm'>
            { children }
        </Button>
    );
}
export default function ActionButtons({ question }: ActionButtonsProps) {
    const {
        questionId,
        title,
        description,
        category,
        complexity
    } = question;
    // run async functions here
    const handleEditOnClick = () => {
        console.log('edit');
    }
    // run async delete here can set spinner
    const handleDeleteOnClick = (event: PressEvent): void => {
        console.log('delete');
    }
    return (
        <div className='flex gap-2 justify-center'>
            <ActionButton onClick={handleEditOnClick} color='warning'>
                <p>Edit</p>
            </ActionButton>
            <ActionButton onClick={handleDeleteOnClick} color='danger'>
                <p>Delete</p>
            </ActionButton>
        </div>
    );
}