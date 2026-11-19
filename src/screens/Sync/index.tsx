import React, {useCallback, useEffect, useState} from 'react';
import {
  HStack,
  ScrollView,
  Text,
  VStack,
  useTheme,
  useToast,
} from 'native-base';
import {useTranslation} from 'react-i18next';
import {useNetInfo} from '@react-native-community/netinfo';
import moment from 'moment';
import SyncService from '../../services/sync.service';
import {StorageService} from '../../services/storage.service';
import {PdpService} from '../../services/pdp.service';
import {getDBConnection} from '../../services/database.service';
import {PdpRuleSet} from '../../types/pdp';
import ListRow from '../../components/ListRow';
import Toast from '../../components/Toast';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Page, {GUTTER} from '../../components/Page';

const InfoRow: React.FC<{label: string; value: string}> = ({label, value}) => (
  <HStack
    py="10px"
    space={3}
    borderBottomWidth="1px"
    borderBottomColor="gray.100">
    <Text w="150px" fontSize="13px" fontWeight={600} color="gray.500">
      {label}
    </Text>
    <Text flex={1} fontSize="14px" color="gray.700">
      {value}
    </Text>
  </HStack>
);

// "Synchronisation" of the mockups (B20): the application works without connection; this
// screen sends what is waiting on the device and receives the updates.
const SyncScreen: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const toast = useToast();
  const {isConnected} = useNetInfo();
  const [pending, setPending] = useState<{key: string; count: number}[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [ruleSet, setRuleSet] = useState<PdpRuleSet>();
  const [grid, setGrid] = useState(0);
  const [running, setRunning] = useState(false);

  const load = useCallback(async () => {
    const db = await getDBConnection();
    setPending(await SyncService.getPendingCounts());
    setLastSync(await StorageService.getLastSync());
    setRuleSet(await PdpService.getPublishedRuleSet());
    setGrid(
      (
        await db.executeSql('SELECT COUNT(*) as count FROM question')
      )[0].rows.raw()[0].count,
    );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const showToast = (success: boolean) =>
    toast.show({
      placement: 'top',
      render: () => (
        <Toast
          type={success ? 'success' : 'error'}
          icon={success ? 'check-circle' : 'wifi-slash'}
          title={success ? t('sync.success') : t('settings.sync-error-title')}
          description={
            success ? undefined : t('settings.sync-error-description')
          }
        />
      ),
    });

  const run = async () => {
    setRunning(true);
    const success = !!isConnected && (await SyncService.trySyncData());
    await load();
    setRunning(false);
    showToast(success);
  };

  return (
    <Page back title={t('sync.title')} noPadding>
      <ScrollView flex={1} px={GUTTER}>
        <Text mt="8px" fontSize="24px" fontWeight={600} color="gray.700">
          {t('sync.title')}
        </Text>
        <Text mt="8px" mb="12px" fontSize="14px" color="gray.600">
          {t('sync.subtitle')}
        </Text>
        <VStack>
          <InfoRow
            label={t('sync.last')}
            value={
              lastSync
                ? moment(lastSync).calendar()
                : t('settings.never-synced')
            }
          />
          <InfoRow
            label={t('sync.grid')}
            value={t('sync.grid-value', {count: grid})}
          />
          <InfoRow
            label={t('sync.rules')}
            value={
              ruleSet
                ? t('sync.rules-value', {
                    version: ruleSet.version,
                    date: ruleSet.published_at
                      ? moment(ruleSet.published_at).format('L')
                      : '—',
                  })
                : '—'
            }
          />
        </VStack>

        <Text
          mt="24px"
          mb="8px"
          fontSize="18px"
          fontWeight={700}
          color="gray.700">
          {t('sync.pending')}
        </Text>
        {pending.length === 0 ? (
          <HStack
            p="8px"
            space={2}
            alignItems="center"
            borderRadius="10px"
            bg="green.0">
            <Icon
              name="check-circle-solid"
              size={18}
              color={theme.colors.green['300']}
            />
            <Text flex={1} fontSize="13px" color="green.300">
              {t('sync.all-synced')}
            </Text>
          </HStack>
        ) : (
          pending.map((item, index) => (
            <ListRow
              key={item.key}
              divider={index > 0}
              title={t(`sync.kinds.${item.key}`)}>
              <Text
                alignSelf="flex-start"
                px="8px"
                borderRadius="999px"
                overflow="hidden"
                fontSize="12px"
                fontWeight={700}
                bg="yellow.0"
                color="yellow.300">
                {item.count}
              </Text>
            </ListRow>
          ))
        )}
      </ScrollView>
      <VStack px={GUTTER} pb="16px" pt="8px">
        {!isConnected && (
          <Text mb="8px" textAlign="center" fontSize="13px" color="gray.500">
            {t('sync.offline')}
          </Text>
        )}
        <Button
          w="full"
          mb={0}
          isLoading={running}
          isLoadingText={t('sync.running') || ''}
          disabled={running || !isConnected}
          onPress={run}>
          {t('sync.button')}
        </Button>
      </VStack>
    </Page>
  );
};

export default SyncScreen;
