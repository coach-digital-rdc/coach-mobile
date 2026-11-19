import React, {useEffect, useState} from 'react';
import {
  Center,
  HStack,
  Spinner,
  Text,
  VStack,
  useTheme,
  useToast,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {useNavigate, useParams} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';
import {useCoachContext} from '../../../providers/coach.provider';
import {ReportKind, ReportService} from '../../../services/report.service';
import {ReportData} from '../../../helpers/report.helper';
import PathRoutes from '../../../routers/paths';
import Icon from '../../../components/Icon';
import Toast from '../../../components/Toast';
import Page, {GUTTER} from '../../../components/Page';

const KINDS: ReportKind[] = ['observation', 'pdp'];

// "Documents PDF" of the mockups (B24, B25): the observation sheet laid out like the paper
// tool and the PDP handed to the teacher, to read on the device and to share.
const ClassObservationReport: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {sessionId = ''} = useParams<{sessionId: string}>();
  const {currentCoach, currentSchool} = useCoachContext();
  const [kind, setKind] = useState<ReportKind>('observation');
  const [data, setData] = useState<ReportData>();
  const [files, setFiles] = useState<{[kind: string]: string}>({});
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    ReportService.loadData(sessionId, currentCoach, currentSchool)
      .then(setData)
      .catch(() => setError(true));
  }, [sessionId, currentCoach, currentSchool]);

  // Each document is generated the first time it is shown
  useEffect(() => {
    if (data && !files[kind]) {
      ReportService.generate(kind, data)
        .then(path => setFiles(current => ({...current, [kind]: path})))
        .catch(() => setError(true));
    }
  }, [data, kind, files]);

  const share = () =>
    files[kind] &&
    data &&
    Share.open({
      url: `file://${files[kind]}`,
      type: 'application/pdf',
      filename: ReportService.fileName(kind, data),
      failOnCancel: false,
    }).catch(() => undefined);

  // Copy of the document in Downloads/Coach Digital; the message lets the user open it
  const download = async () => {
    if (!files[kind] || !data || downloading) {
      return;
    }
    const path = files[kind];
    const fileName = ReportService.fileName(kind, data);
    setDownloading(true);
    try {
      await ReportService.download(path, fileName);
      toast.show({
        placement: 'top',
        duration: 5000,
        render: () => (
          <TouchableOpacity onPress={() => ReportService.open(path)}>
            <Toast
              icon="check-circle"
              type="success"
              title={t('classObservation.report.downloaded')}
              description={t('classObservation.report.downloaded-detail', {
                file: `${fileName}.pdf`,
              })}
            />
          </TouchableOpacity>
        ),
      });
    } catch (err) {
      toast.show({
        placement: 'top',
        render: () => (
          <Toast
            icon="exclamation-circle"
            type="error"
            title={t('classObservation.report.download-error')}
          />
        ),
      });
    } finally {
      setDownloading(false);
    }
  };

  const goBack = () =>
    navigate(
      PathRoutes.classObservation.completed.replace(':sessionId', sessionId),
      {replace: true},
    );

  return (
    <Page
      back
      title={t('classObservation.report.title')}
      onBack={goBack}
      noPadding>
      <HStack mx="16px" mt="8px" p="4px" borderRadius="12px" bg="gray.100">
        {KINDS.map(item => {
          const active = item === kind;
          return (
            <TouchableOpacity
              key={item}
              style={{flex: 1}}
              accessibilityRole="tab"
              accessibilityState={{selected: active}}
              onPress={() => setKind(item)}>
              <Text
                py="8px"
                textAlign="center"
                fontSize="14px"
                borderRadius="9px"
                overflow="hidden"
                bg={active ? 'white' : 'transparent'}
                color={active ? 'primary.200' : 'gray.600'}
                fontWeight={active ? 600 : 400}>
                {t(`classObservation.report.${item}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </HStack>

      <HStack
        mx="16px"
        my="8px"
        space={2}
        alignItems="center"
        justifyContent="space-between">
        <HStack flex={1} space={2} alignItems="center">
          <Icon name="file-alt" size={16} color={theme.colors.red['200']} />
          <Text flex={1} fontSize="13px" color="gray.700" numberOfLines={1}>
            {data ? `${ReportService.fileName(kind, data)}.pdf` : ''}
          </Text>
        </HStack>
        <TouchableOpacity
          disabled={!files[kind] || downloading}
          accessibilityLabel={t('classObservation.report.download')}
          onPress={download}>
          <HStack space={1} alignItems="center">
            {downloading ? (
              <Spinner size="sm" />
            ) : (
              <Icon
                name="download-alt"
                size={18}
                color={theme.colors.primary['200']}
              />
            )}
            <Text fontSize="14px" fontWeight={600} color="primary.200">
              {t('classObservation.report.download')}
            </Text>
          </HStack>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!files[kind]}
          accessibilityLabel={t('classObservation.report.share')}
          onPress={share}>
          <HStack space={1} alignItems="center">
            <Icon
              name="share-alt"
              size={18}
              color={theme.colors.primary['200']}
            />
            <Text fontSize="14px" fontWeight={600} color="primary.200">
              {t('classObservation.report.share')}
            </Text>
          </HStack>
        </TouchableOpacity>
      </HStack>

      <VStack flex={1} bg="gray.200">
        {error ? (
          <Center flex={1} px={GUTTER}>
            <Text textAlign="center" color="gray.600">
              {t('classObservation.report.error')}
            </Text>
          </Center>
        ) : files[kind] ? (
          <Pdf
            key={kind}
            source={{uri: `file://${files[kind]}`}}
            style={{flex: 1, backgroundColor: theme.colors.gray['200']}}
          />
        ) : (
          <Center flex={1}>
            <Spinner size="lg" />
            <Text mt="8px" color="gray.600">
              {t('classObservation.report.generating')}
            </Text>
          </Center>
        )}
      </VStack>
    </Page>
  );
};

export default ClassObservationReport;
