import React from 'react';
import {HStack, Modal, Text, VStack} from 'native-base';
import {useTranslation} from 'react-i18next';
import Button from '../Button';

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isLoading?: boolean;
  cancelLabel?: string;
  // A required step (e.g. a mandatory update) has no cancel button
  hideCancel?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// Confirmation of the mockups before a step that cannot be undone (e.g. end of the observation).
const ConfirmDialog: React.FC<Props> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  isLoading,
  cancelLabel,
  hideCancel,
  onConfirm,
  onCancel,
}) => {
  const {t} = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      // A required step cannot be closed with the back button either
      onClose={hideCancel ? () => {} : onCancel}
      closeOnOverlayClick={!hideCancel}>
      <VStack w="90%" maxW="420px" p="20px" borderRadius="16px" bg="white">
        <Text fontSize="18px" fontWeight={700} color="gray.700">
          {title}
        </Text>
        <Text mt="8px" fontSize="14px" color="gray.600">
          {message}
        </Text>
        <HStack mt="20px" space={3}>
          {!hideCancel && (
            <Button flex={1} mb={0} variant="outlined" onPress={onCancel}>
              {cancelLabel || t('common.cancel')}
            </Button>
          )}
          <Button flex={1} mb={0} isLoading={isLoading} onPress={onConfirm}>
            {confirmLabel}
          </Button>
        </HStack>
      </VStack>
    </Modal>
  );
};

export default ConfirmDialog;
