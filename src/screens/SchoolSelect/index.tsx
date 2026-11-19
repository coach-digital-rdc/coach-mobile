import React, {useCallback, useState} from 'react';
import {useCoachContext} from '../../providers/coach.provider';
import {SchoolService} from '../../services/school.service';
import {CoachService} from '../../services/coach.service';
import {TouchableOpacity} from 'react-native';
import Icon from '../../components/Icon';
import ListRow from '../../components/ListRow';
import SearchField from '../../components/SearchField';
import {useNavigate} from 'react-router-native';
import useDebounce from '../../hooks/debounce';
import {useTranslation} from 'react-i18next';
import PathRoutes from '../../routers/paths';
import {School} from '../../types/school';
import Page from '../../components/Page';
import {Text, HStack, VStack, Spinner, FlatList, useTheme} from 'native-base';

const SchoolSelectScreen: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [schoolList, setSchoolList] = useState<School[]>([]);

  const {t} = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const {selectSchool, currentSchool, currentCoach} = useCoachContext();

  const loadSchools = useCallback(async (value: string) => {
    setIsLoading(true);
    setSchoolList(await SchoolService.findSchoolItems(value));
    setIsLoading(false);
  }, []);

  useDebounce(filter, 300, loadSchools);

  const onSelectSchool = async (school: School) => {
    await selectSchool(school);

    if (currentCoach) {
      navigate(PathRoutes.home.main, {replace: true});
    } else {
      navigate(PathRoutes.selectAccount, {replace: true});
    }
  };

  return (
    <Page setting back={!!currentSchool} title={t('schoolSelect.header') || ''}>
      <Text fontSize="24px" fontWeight={600} color="gray.700">
        {t('schoolSelect.title')}
      </Text>
      <Text mt="8px" mb="16px" fontSize="14px" color="gray.600">
        {t('schoolSelect.subtitle')}
      </Text>

      <TouchableOpacity onPress={() => navigate(PathRoutes.qrScan)}>
        <HStack
          p="12px"
          space={3}
          alignItems="center"
          borderWidth="1px"
          borderStyle="dashed"
          borderRadius="12px"
          borderColor="primary.200"
          bg="primary.0">
          <Icon
            name="qrcode-scan"
            size={28}
            color={theme.colors.primary['200']}
          />
          <VStack flex={1}>
            <Text fontSize="14px" fontWeight={700} color="gray.700">
              {t('schoolSelect.qr-title')}
            </Text>
            <Text fontSize="12px" color="gray.600">
              {t('schoolSelect.qr-hint')}
            </Text>
          </VStack>
          <Icon name="angle-right" size={20} color={theme.colors.gray['500']} />
        </HStack>
      </TouchableOpacity>

      {isLoading ? (
        <Spinner mt="24px" />
      ) : schoolList.length > 0 || filter ? (
        <>
          <SearchField
            value={filter}
            onChangeText={setFilter}
            placeholder={t('schoolSelect.search') || ''}
          />
          <FlatList
            data={schoolList}
            keyExtractor={item => item.id || ''}
            ListEmptyComponent={
              <Text
                mt="16px"
                textAlign="center"
                fontSize="14px"
                color="gray.500">
                {t('schoolSelect.empty')}
              </Text>
            }
            renderItem={({item, index}) => (
              <ListRow
                divider={index > 0}
                icon="book-alt"
                title={item.name || ''}
                subtitle={t('schoolSelect.item-description_interval', {
                  postProcess: 'interval',
                  count: item.teachersCount,
                })}
                onPress={() => onSelectSchool(item)}
              />
            )}
          />
        </>
      ) : (
        <Text mt="24px" textAlign="center" fontSize="14px" color="gray.600">
          {t('aboutScan.description')}
        </Text>
      )}
    </Page>
  );
};

export default SchoolSelectScreen;
