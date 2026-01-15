import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { useGetDGProjectDetailsAppQuery } from '@/store/api/api'
import { RLoader } from '@/components/common'
import ProjectDetailRenderItem from './ProjectDetailsRenderItem'

interface ProjectDetailsItemProps {
    projectId: number
}

const ProjectDetailsItem: React.FC<ProjectDetailsItemProps> = ({ projectId }) => {
    const { data, isLoading, error } = useGetDGProjectDetailsAppQuery(projectId)

    if (isLoading) {
        return <RLoader />
    }

    if (error) {
        return (
            <View style={{ padding: 16 }}>
                <Text style={{ color: 'red' }}>Error loading project details</Text>
            </View>
        )
    }

    const items = data?.result?.items || []

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={items}
                renderItem={({ item }) => <ProjectDetailRenderItem item={item} />}
                keyExtractor={(item) => `${item.projectDetails.id}`}
                scrollEnabled={false}
            />
        </View>
    )
}

export default ProjectDetailsItem