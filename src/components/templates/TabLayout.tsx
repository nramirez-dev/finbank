import { View, Text } from 'react-native';
import { PageLayout } from './PageLayout';

interface TabLayoutProps {
  children: React.ReactNode;
  title?: string;
  scrollable?: boolean;
}

export const TabLayout = ({ children, title, scrollable }: TabLayoutProps) => {
  return (
    <PageLayout scrollable={scrollable}>
      {title && (
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">{title}</Text>
        </View>
      )}
      {children}
    </PageLayout>
  );
};
