import {COUNTRY} from '@env';
import React, {useCallback, useEffect, useState} from 'react';
import {Center} from 'native-base';
import PathRoutes from '../../../../../routers/paths';
import {useNavigate} from 'react-router-native';
import InfiniteScroll from '../../../../../components/InfiniteScroll';
import SessionListEmpty from './SessionListEmpty';
import {SessionService} from '../../../../../services/session.service';
import SessionItem from './SessionItem';
import {Session} from '../../../../../types/session';

const ITEMS_PER_PAGE = 20;

type Props = {
  teacherId: string;
  onResume?: (session: Session) => void;
};

const OPEN_STATUSES = ['PREPARATION', 'OBSERVATION', 'EVALUATION'];

const SessionList: React.FC<Props> = ({teacherId, onResume}) => {
  const [page, setPage] = useState(1);
  const [isTheEnd, setIsTheEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionList, setSessionList] = useState<Session[]>([]);

  const navigate = useNavigate();

  const loadFirstPageWithFilter = useCallback(async () => {
    setSessionList([]);
    setIsLoading(true);
    setIsTheEnd(false);
    const data = await SessionService.findSessionFromTeacher(
      teacherId,
      ITEMS_PER_PAGE,
      1,
    );
    if (data.length < ITEMS_PER_PAGE) {
      setIsTheEnd(true);
    }
    setSessionList(data);
    setIsLoading(false);
  }, [teacherId]);

  useEffect(() => {
    loadFirstPageWithFilter();
  }, [loadFirstPageWithFilter]);

  const loadNextPage = async () => {
    if (!isLoading && !isTheEnd) {
      setPage(page + 1);
      setIsLoading(true);
      const data = await SessionService.findSessionFromTeacher(
        teacherId,
        ITEMS_PER_PAGE,
        page + 1,
      );

      if (data.length < ITEMS_PER_PAGE) {
        setIsTheEnd(true);
      }
      setSessionList(prevData => [...prevData, ...data]);
    }
  };

  return (
    <>
      <InfiniteScroll
        isEnd={isTheEnd}
        data={sessionList}
        isLoading={isLoading}
        loadNextPage={loadNextPage}
        emptyComponent={
          <Center mt={'80px'}>
            <SessionListEmpty />
          </Center>
        }
        renderItem={({item, index}) => (
          <SessionItem
            key={index}
            index={index}
            session={item}
            onPress={() =>
              onResume && OPEN_STATUSES.includes(item.session_status || '')
                ? onResume(item)
                : COUNTRY === 'cd' && item.session_status === 'COMPLETED'
                ? // Summary of the closed session and its PDF documents
                  navigate(
                    PathRoutes.classObservation.completed.replace(
                      ':sessionId',
                      item.id,
                    ),
                    {state: {fromTeacher: true}},
                  )
                : navigate(PathRoutes.session.details, {state: item})
            }
          />
        )}
      />
    </>
  );
};

export default SessionList;
