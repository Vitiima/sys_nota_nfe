/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
    HStack,
    Stack,
    Table,
    PaginationItem,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
    Flex,
    Box,
    Input,
    Button,
    VStack,
    Text,
    useBreakpointValue,
    LinkBox,
    LinkOverlay,
    Spinner,
    Link,
} from "@chakra-ui/react";




const CustomTable = () => {
    const [items, setItems] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [filters, setFilters] = useState({ id: "", nome: "", cnpj: "", rs: "" });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 14;

    const fetchData = async () => {
        try {

            const response = await fetch(`/api/cliente/getall`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            const transformedData = data.map((item: any) => ({
                id: item.id,
                nome: item.cliente,
                rs: item.razaoSocial,
                telefone: item.telefone,
                cnpj: item.cnpj,
            }));

            setItems(transformedData);
            setFilteredData(transformedData);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const applyFilters = () => {
        const newFilteredData = items.filter((user) => {
            return (
                (filters.id === "" || user.id?.toString().includes(filters.id)) &&
                (filters.nome === "" || user.nome?.toLowerCase().includes(filters.nome.toLowerCase())) &&
                (filters.cnpj === "" || user.cnpj?.includes(filters.cnpj)) &&
                (filters.rs === "" || user.rs?.toLowerCase().includes(filters.rs.toLowerCase()))
            );
        });

        setFilteredData(newFilteredData);
        setCurrentPage(1);
    };


    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );


    const handleFilterChange = (field: string, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };


    const isMobile = useBreakpointValue({ base: true, md: false });

    return loading ? (
        <HStack
            justify="center"
            align="center"
            gap="5"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="full"
            h="full"
        >
            <Spinner color="green.800" size="lg" />
            <Text color="green.800" fontSize="xl">Carregando...</Text>
        </HStack>
    ) : (
        <Stack width="full" gap="4" h="fit" color="white">

            <Flex
                bg="green.600"
                py={4}
                borderRadius="lg"
                direction="column"
                gap={4}
                boxShadow="md"
            >
                <Flex wrap="wrap" gap={4} justify="space-around">
                    <Box>
                        <label>ID:  </label>
                        <Input
                            placeholder="Filtrar por ID"
                            value={filters.id}
                            onChange={(e) => handleFilterChange("id", e.target.value)}
                            size="sm"
                            maxW="200px"
                            bg="white"
                            color="black"
                        />
                    </Box>

                    <Box>
                        <label>Nome:  </label>
                        <Input
                            placeholder="Filtrar por Nome"
                            value={filters.nome}
                            onChange={(e) => handleFilterChange("nome", e.target.value)}
                            size="sm"
                            maxW="200px"
                            bg="white"
                            color="black"
                        />
                    </Box>

                    <Box>
                        <label>Razão Social:  </label>
                        <Input
                            placeholder="Razão Social"
                            value={filters.rs}
                            onChange={(e) => handleFilterChange("rs", e.target.value)}
                            size="sm"
                            maxW="200px"
                            bg="white"
                            color="black"
                        />
                    </Box>

                    <Box>
                        <label>CNPJ:  </label>
                        <Input
                            placeholder="Filtrar por CNPJ"
                            value={filters.cnpj}
                            onChange={(e) => handleFilterChange("cnpj", e.target.value)}
                            size="sm"
                            maxW="200px"
                            bg="white"
                            color="black"
                        />
                    </Box>

                    <Button
                        onClick={applyFilters}
                        colorScheme="green"
                        size="sm"
                        alignSelf="flex-end"
                    >
                        Aplicar Filtros
                    </Button>
                </Flex>
            </Flex>


            {isMobile ? (
                <VStack w="full" align="stretch">
                    <Flex w="full" justify="center" wrap="wrap" gap={4}>
                        {paginatedData.map((user) => (
                            <Link key={user.id} href={`/cliente/${user.id}`} _hover={{ textDecoration: "none" }}>
                                <Box
                                    bg="white"
                                    p={4}
                                    borderRadius="lg"
                                    boxShadow="sm"
                                    color="black"
                                    transition="0.2s"
                                    _hover={{ bg: "green.100", transform: "scale(1.02)" }}
                                    w={{ base: "100%", sm: "100%", md: "320px" }}
                                    minW="280px"
                                    cursor="pointer"
                                >
                                    <Flex direction="column" align="start" w="full">
                                        <Text>
                                            <b>ID:</b> {user.id}
                                        </Text>
                                        <Text>
                                            <b>Nome:</b> {user.nome}
                                        </Text>
                                        <Text>
                                            <b>Razão Social:</b> {user.rs}
                                        </Text>
                                        <Text>
                                            <b>Telefone:</b> {user.telefone}
                                        </Text>
                                        <Text>
                                            <b>CNPJ:</b> {user.cnpj}
                                        </Text>
                                    </Flex>
                                </Box>
                            </Link>
                        ))}
                    </Flex>
                </VStack>

            ) : (


                <Table.Root variant="outline" size="sm" boxShadow="lg" rounded="lg" color="black">
                    <Table.Header py={4}>
                        <Table.Row bg="green.600">
                            <Table.ColumnHeader py="4" fontSize="lg" color="white" minW="50px" textAlign="center">Id</Table.ColumnHeader>
                            <Table.ColumnHeader py="4" fontSize="lg" color="white" minW="150px" textAlign="center">Nome</Table.ColumnHeader>
                            <Table.ColumnHeader py="4" fontSize="lg" color="white" minW="200px" textAlign="center">Razão Social</Table.ColumnHeader>
                            <Table.ColumnHeader py="4" fontSize="lg" color="white" minW="150px" textAlign="center">Telefone</Table.ColumnHeader>
                            <Table.ColumnHeader py="4" fontSize="lg" color="white" minW="180px" textAlign="center">CNPJ</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {paginatedData.map((user) => (
                            <LinkBox as={Table.Row}
                                key={user.id}
                                _hover={{ bg: "green.100" }}
                                fontWeight="bold"
                                color="black"
                            >
                                <Table.Cell fontSize={"sm"} px={6} py={3} textAlign="center" verticalAlign="middle">
                                    <LinkOverlay href={`/cliente/${user.id}`}>{user.id}</LinkOverlay>
                                </Table.Cell>
                                <Table.Cell fontSize={"sm"} px={6} py={3} textAlign="center" verticalAlign="middle">
                                    {user.nome}
                                </Table.Cell>
                                <Table.Cell fontSize={"sm"} px={6} py={3} textAlign="center" verticalAlign="middle">{user.rs}</Table.Cell>
                                <Table.Cell fontSize={"sm"} px={6} py={3} textAlign="center" verticalAlign="middle">{user.telefone}</Table.Cell>
                                <Table.Cell fontSize={"sm"} px={6} py={3} textAlign="center" verticalAlign="middle">{user.cnpj}</Table.Cell>
                            </LinkBox>
                        ))}
                    </Table.Body>
                </Table.Root>

            )}


            <PaginationRoot
                count={filteredData.length}
                pageSize={pageSize}
                page={currentPage}
                onChange={(e) => {
                    const page = Number((e.target as HTMLButtonElement).value);
                    setCurrentPage(page);
                }}
            >
                <HStack wrap="wrap" justify="end" >
                    <PaginationPrevTrigger
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        _hover={{ bg: "green.600", color: "white" }}
                        bg="green.400"
                        color="white"
                        px={4}
                        py={2}
                        borderRadius="md"
                        boxShadow="sm"
                    >
                        Anterior
                    </PaginationPrevTrigger>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <PaginationItem
                            key={index}
                            value={index + 1}
                            type="page"
                            _hover={{
                                bg: "green.400",
                                color: "white",
                            }}
                            _active={{
                                bg: "green.600",
                                color: "white",
                                fontWeight: "bold",
                            }}
                            bg={currentPage === index + 1 ? "green.700" : "green.400"}
                            color="white"
                            px={4}
                            boxShadow="sm"
                            py={2}
                            borderRadius="md"
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </PaginationItem>
                    ))}

                    <PaginationNextTrigger
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        _hover={{ bg: "green.600", color: "white" }}
                        bg="green.400"
                        color="white"
                        px={4}
                        py={2}
                        borderRadius="md"
                        boxShadow="sm"
                    >
                        Próximo
                    </PaginationNextTrigger>
                </HStack>
            </PaginationRoot>
        </Stack>
    );
};

export default CustomTable;
